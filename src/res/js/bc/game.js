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
		var projectionMatrixLocation = gl.getUniformLocation(program, "u_projectionMatrix");
		var viewMatrixLocation = gl.getUniformLocation(program, "u_viewMatrix");
		var matrixLocation = gl.getUniformLocation(program, "u_matrix");

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

		var boardModel = BC.Board.makeModel({
			numRingCells: 24,
			numBlockStyles: 6,
			innerRingRadius: 0.75,
			outerRingRadius: 1,
			ringMaxY: 0.15,
			ringMinY: -0.15
		});

		var boardView = BC.Board.makeView(boardModel, gl, positionLocation, matrixLocation, textureCoordLocation);

		var Direction = BC.Common.Direction;

		var touchThreshold = 50;
		var touchStartX = 0;
		var touchStartY = 0;

		$(canvas).on("touchstart touchmove touchend", function(event) {
			var touch = event.originalEvent.changedTouches[0];
			switch (event.type) {
				case "touchstart":
					touchStartX = touch.pageX;
					touchStartY = touch.pageY;
					break;

				case "touchend":
					var deltaX = touch.pageX - touchStartX;
					var deltaY = touch.pageY - touchStartY;

					var direction = Direction.NONE;
					if (deltaX > touchThreshold) {
						direction = Direction.LEFT;
					} else if (deltaX < -touchThreshold) {
						direction = Direction.RIGHT;
					} else if (deltaY > touchThreshold) {
						direction = Direction.DOWN;
					} else if (deltaY < -touchThreshold) {
						direction = Direction.UP;
					}
					boardModel.move(direction);
					break;
			}
			return false;
		});

		var keyCodeDirectionMap = {
			37: Direction.LEFT,
			39: Direction.RIGHT,
			38: Direction.UP,
			40: Direction.DOWN
		};

		$(document).keydown(function(event) {
			var direction = keyCodeDirectionMap[event.keyCode];
			boardModel.move(direction);
			return false;
		});

		var then = BC.Time.getTimeInSeconds();

		function drawScene() {
			gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
			gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

			var now = BC.Time.getTimeInSeconds();
			var deltaTime = now - then;
			then = now;

			gl.uniformMatrix4fv(projectionMatrixLocation, false, projectionMatrix);
			gl.uniformMatrix4fv(viewMatrixLocation, false, viewMatrix);

			boardModel.update(deltaTime);
			boardView.draw();

			requestAnimationFrame(drawScene);
		}

		drawScene();
	}

	return parent;

}(BC || {}))

$(document).ready(function() {
	BC.Game.run();
});
