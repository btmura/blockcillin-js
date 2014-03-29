var BC = (function(parent) {

	var my = parent.Game = parent.Game || {}

	my.run = function() {
		var canvas = document.getElementById("canvas");
		if (!canvas) {
			return;
		}

		var gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
		if (!gl) {
			return;
		}

		gl.enable(gl.CULL_FACE);
		gl.enable(gl.DEPTH_TEST);
		gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

		var vertexShader = BC.GL.loadShader(gl, 'vertex-shader', gl.VERTEX_SHADER);
		var fragmentShader = BC.GL.loadShader(gl, 'fragment-shader', gl.FRAGMENT_SHADER);
		var program = BC.GL.createProgram(gl, [vertexShader, fragmentShader]);
		gl.useProgram(program);

		var positionLocation = gl.getAttribLocation(program, "a_position");
		var textureCoordLocation = gl.getAttribLocation(program, "a_texcoord");
		var matrixLocation = gl.getUniformLocation(program, "u_matrix");

		var then = BC.Time.getTimeInSeconds();

		var rotation = [0, 0, 0];
		var scale = [1, 1, 1];
		var scaleMatrix = BC.Matrix.makeScale(scale[0], scale[1], scale[2]);

		var up = [0, 1, 0];
		var cameraPosition = [0, 0.75, 2];
		var targetPosition = [0, 0, 0];
		var cameraMatrix = BC.Matrix.makeLookAt(cameraPosition, targetPosition, up);
		var viewMatrix = BC.Matrix.makeInverse(cameraMatrix);

		var texture = gl.createTexture();
		gl.bindTexture(gl.TEXTURE_2D, texture);

		// Fill the texture with a 1x1 black pixel.
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([0, 0, 0, 255]));

		var image = new Image();
		image.src = "images/textures.png";
		$(image).load(function() {
			gl.bindTexture(gl.TEXTURE_2D, texture);
			gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA,gl.UNSIGNED_BYTE, image);
			gl.generateMipmap(gl.TEXTURE_2D);
		});

		var rotationSpeed = [0, 0, 0];
		$(document).keydown(function(event) {
			switch (event.keyCode) {
				// Space
				case 32:
					rotationSpeed[0] = 0;
					rotationSpeed[1] = 0;
					break;

				// Left
				case 37:
					rotationSpeed[0] = 0;
					rotationSpeed[1] = -1;
					break;

				// Up
				case 38:
					rotationSpeed[0] = -1;
					rotationSpeed[1] = 0;
					break;

				// Right
				case 39:
					rotationSpeed[0] = 0;
					rotationSpeed[1] = 1;
					break;

				// Down
				case 40:
					rotationSpeed[0] = 1;
					rotationSpeed[1] = 0;
					break;
			}
		});

		var numSlices = 24;
		var innerRadius = 0.75;
		var outerRadius = 1;
		var maxY = 0.15;
		var minY = -0.15;

		var metrics = {
			numSlices: numSlices,
			innerRadius: innerRadius,
			outerRadius: outerRadius,
			maxY: maxY,
			minY: minY
		};

		// Sets the canvas's width and height to the size it's being displayed at.
		function resizeCanvas() {
			// Compare current dimensions to displayed dimensions and set them if different.
			if (canvas.width != canvas.clientWidth || canvas.height != canvas.clientHeight) {
				canvas.width = canvas.clientWidth;
				canvas.height = canvas.clientHeight;
				return true;
			}
			return false;
		}

		// Initially resize the canvas since setting the width to 100% width just scales.
		resizeCanvas();

		// Creates the projection matrix based upon the current canvas dimensions.
		function makeProjectionMatrix() {
			var aspect = canvas.width / canvas.height;
			var fieldOfViewRadians = BC.Math.radians(90);
			return BC.Matrix.makePerspective(fieldOfViewRadians, aspect, 1, 2000);
		}

		// Create the inital projection matrix.
		var projectionMatrix = makeProjectionMatrix();

		// Set a window resize event listener to adjust the canvas and projection matrix.
		$(window).resize(function() {
			if (resizeCanvas()) {
				projectionMatrix = makeProjectionMatrix();
			}
		});

		var tileSet = BC.GL.textureTileSet(4, 4, 0.002);
		var ringTextureTiles = [
			tileSet.tile(0, 0),
			tileSet.tile(0, 1),
			tileSet.tile(0, 2),
			tileSet.tile(0, 3),
			tileSet.tile(1, 0),
			tileSet.tile(1, 1)
		];
		var selectorTextureTile = tileSet.tile(1, 2);

		var ring = BC.Ring.makeRing(gl, metrics, ringTextureTiles);
		var selector = BC.Selector.makeSelector(gl, metrics, selectorTextureTile);

		function drawScene() {
			gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
			gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

			var now = BC.Time.getTimeInSeconds();
			var deltaTime = now - then;
			then = now;

			rotation[0] += rotationSpeed[0] * deltaTime;
			rotation[1] += rotationSpeed[1] * deltaTime;

			var rotationZMatrix = BC.Matrix.makeZRotation(rotation[2]);
			var rotationYMatrix = BC.Matrix.makeYRotation(rotation[1]);
			var rotationXMatrix = BC.Matrix.makeXRotation(rotation[0]);

			var matrix = BC.Matrix.matrixMultiply(scaleMatrix, rotationZMatrix);
			matrix = BC.Matrix.matrixMultiply(matrix, rotationYMatrix);
			matrix = BC.Matrix.matrixMultiply(matrix, rotationXMatrix);
			matrix = BC.Matrix.matrixMultiply(matrix, viewMatrix);
			matrix = BC.Matrix.matrixMultiply(matrix, projectionMatrix);

			gl.uniformMatrix4fv(matrixLocation, false, matrix);
			ring.draw(positionLocation, textureCoordLocation);

			matrix = BC.Matrix.matrixMultiply(scaleMatrix, viewMatrix);
			matrix = BC.Matrix.matrixMultiply(matrix, projectionMatrix);
			gl.uniformMatrix4fv(matrixLocation, false, matrix);

			selector.draw(positionLocation, textureCoordLocation);

			requestAnimationFrame(drawScene);
		}

		drawScene();
	}

	return parent;

}(BC || {}))

$(document).ready(function() {
	BC.Game.run();
});
