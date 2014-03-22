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

		var vertexShader = BC.GL.loadShader(gl, 'vertex-shader', gl.VERTEX_SHADER);
		var fragmentShader = BC.GL.loadShader(gl, 'fragment-shader', gl.FRAGMENT_SHADER);
		var program = BC.GL.createProgram(gl, [vertexShader, fragmentShader]);
		gl.useProgram(program);

		var positionLocation = gl.getAttribLocation(program, "a_position");
		var texcoordLocation = gl.getAttribLocation(program, "a_texcoord");
		var matrixLocation = gl.getUniformLocation(program, "u_matrix");

		var then = BC.Time.getTimeInSeconds();

		var rotation = [BC.Math.radians(0), BC.Math.radians(0), BC.Math.radians(0)];

		var scale = [1, 1, 1];
		var scaleMatrix = BC.Matrix.makeScale(scale[0], scale[1], scale[2]);

		var translation = [0, 0, 0];
		var translationMatrix = BC.Matrix.makeTranslation(translation[0], translation[1], translation[2]);

		var up = [0, 1, 0];
		var cameraPosition = [0, 0.75, 2];
		var targetPosition = [0, 0, 0];
		var cameraMatrix = BC.Matrix.makeLookAt(cameraPosition, targetPosition, up);
		var viewMatrix = BC.Matrix.makeInverse(cameraMatrix);

		var texture = gl.createTexture();
		gl.bindTexture(gl.TEXTURE_2D, texture);
		// Fill the texture with a 1x1 red pixel.
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([255, 0, 0, 255]));

		var image = new Image();
		image.src = "images/block-texture.png";
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

		var innerCirclePoints = BC.Math.circlePoints(innerRadius, numSlices);
		var outerCirclePoints = BC.Math.circlePoints(outerRadius, numSlices);

		var tileSet = BC.GL.textureTileSet(4, 4, 0.01);
		var tiles = [
			tileSet.tile(0, 0),
			tileSet.tile(0, 1),
			tileSet.tile(0, 2),
			tileSet.tile(0, 3),
			tileSet.tile(1, 0),
			tileSet.tile(1, 1)
		];

		var points = []; // 3D points

		var textureCoords = []; // 2D points
		var t = 0;

		var setTextureCoords = function(tile, s1, t1, s2, t2, s3, t3) {
			var tc = tile.textureCoord(s1, t1);
			textureCoords[t++] = tc[0];
			textureCoords[t++] = tc[1];

			tc = tile.textureCoord(s2, t2);
			textureCoords[t++] = tc[0];
			textureCoords[t++] = tc[1];

			tc = tile.textureCoord(s3, t3);
			textureCoords[t++] = tc[0];
			textureCoords[t++] = tc[1];
		};

		var tileIndex = 0;
		var prevTileIndex = 0;

		for (var s = 0, i = 0, p = 0; s < numSlices; s++, p += 2) {
			// Calculate index for next point. Use modulus since we reuse the last point.
			var np = (p + 2) % outerCirclePoints.length;

			while (prevTileIndex === tileIndex) {
				tileIndex = Math.floor(Math.random() * tiles.length);
			}
			prevTileIndex = tileIndex;
			var tile = tiles[tileIndex];

			// TOP FACE

			// 1st triangle of two for quad slice.
			points[i++] = innerCirclePoints[p];
			points[i++] = maxY;
			points[i++] = -innerCirclePoints[p + 1];

			points[i++] = outerCirclePoints[p];
			points[i++] = maxY;
			points[i++] = -outerCirclePoints[p + 1];

			points[i++] = outerCirclePoints[np];
			points[i++] = maxY;
			points[i++] = -outerCirclePoints[np + 1];

			setTextureCoords(tile, 0, 0, 0, 1, 1, 1);

			// 2nd triangle of two for quad slice.
			points[i++] = innerCirclePoints[p];
			points[i++] = maxY;
			points[i++] = -innerCirclePoints[p + 1];

			points[i++] = outerCirclePoints[np];
			points[i++] = maxY;
			points[i++] = -outerCirclePoints[np + 1];

			points[i++] = innerCirclePoints[np];
			points[i++] = maxY;
			points[i++] = -innerCirclePoints[np + 1];

			setTextureCoords(tile, 0, 0, 1, 1, 1, 0);

			// BOTTOM FACE

			// 1st triangle of two for quad slice.
			points[i++] = innerCirclePoints[p];
			points[i++] = minY;
			points[i++] = -innerCirclePoints[p + 1];

			points[i++] = outerCirclePoints[np];
			points[i++] = minY;
			points[i++] = -outerCirclePoints[np + 1];

			points[i++] = outerCirclePoints[p];
			points[i++] = minY;
			points[i++] = -outerCirclePoints[p + 1];

			setTextureCoords(tile, 0, 0, 1, 1, 0, 1);

			// 2nd triangle of two for quad slice.
			points[i++] = innerCirclePoints[p];
			points[i++] = minY;
			points[i++] = -innerCirclePoints[p + 1];

			points[i++] = innerCirclePoints[np];
			points[i++] = minY;
			points[i++] = -innerCirclePoints[np + 1];

			points[i++] = outerCirclePoints[np];
			points[i++] = minY;
			points[i++] = -outerCirclePoints[np + 1];

			setTextureCoords(tile, 0, 0, 1, 0, 1, 1);

			// OUTER FACE

			// 1st triangle of two for quad slice.
			points[i++] = outerCirclePoints[p];
			points[i++] = minY;
			points[i++] = -outerCirclePoints[p + 1];

			points[i++] = outerCirclePoints[np];
			points[i++] = minY;
			points[i++] = -outerCirclePoints[np + 1];

			points[i++] = outerCirclePoints[np];
			points[i++] = maxY;
			points[i++] = -outerCirclePoints[np + 1];

			setTextureCoords(tile, 0, 1, 1, 1, 1, 0);

			// 2nd triangle of two for quad slice.
			points[i++] = outerCirclePoints[p];
			points[i++] = minY;
			points[i++] = -outerCirclePoints[p + 1];

			points[i++] = outerCirclePoints[np];
			points[i++] = maxY;
			points[i++] = -outerCirclePoints[np + 1];

			points[i++] = outerCirclePoints[p];
			points[i++] = maxY;
			points[i++] = -outerCirclePoints[p + 1];

			setTextureCoords(tile, 0, 1, 1, 0, 0, 0);

			// INNER FACE

			// 1st triangle of two for quad slice.
			points[i++] = innerCirclePoints[p];
			points[i++] = minY;
			points[i++] = -innerCirclePoints[p + 1];

			points[i++] = innerCirclePoints[np];
			points[i++] = maxY;
			points[i++] = -innerCirclePoints[np + 1];

			points[i++] = innerCirclePoints[np];
			points[i++] = minY;
			points[i++] = -innerCirclePoints[np + 1];

			setTextureCoords(tile, 0, 1, 1, 0, 1, 1);

			// 2nd triangle of two for quad slice.
			points[i++] = innerCirclePoints[p];
			points[i++] = minY;
			points[i++] = -innerCirclePoints[p + 1];

			points[i++] = innerCirclePoints[p];
			points[i++] = maxY;
			points[i++] = -innerCirclePoints[p + 1];

			points[i++] = innerCirclePoints[np];
			points[i++] = maxY;
			points[i++] = -innerCirclePoints[np + 1];

			setTextureCoords(tile, 0, 1, 0, 0, 1, 0);
		}

		var pointData = new Float32Array(points);
		var textureCoordData = new Float32Array(textureCoords);

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

		function drawScene() {
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
			matrix = BC.Matrix.matrixMultiply(matrix, translationMatrix);
			matrix = BC.Matrix.matrixMultiply(matrix, viewMatrix);
			matrix = BC.Matrix.matrixMultiply(matrix, projectionMatrix);

			var buffer = gl.createBuffer();
			gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
			gl.bufferData(gl.ARRAY_BUFFER, pointData, gl.STATIC_DRAW);
			gl.enableVertexAttribArray(positionLocation);
			gl.vertexAttribPointer(positionLocation, 3, gl.FLOAT, false, 0, 0);
			gl.uniformMatrix4fv(matrixLocation, false, matrix);

			var textureBuffer = gl.createBuffer();
			gl.bindBuffer(gl.ARRAY_BUFFER, textureBuffer);
			gl.enableVertexAttribArray(texcoordLocation);
			gl.vertexAttribPointer(texcoordLocation, 2, gl.FLOAT, false, 0, 0);
			gl.bufferData(gl.ARRAY_BUFFER, textureCoordData, gl.STATIC_DRAW);

			gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
			gl.drawArrays(gl.TRIANGLES, 0, points.length / 3);

			requestAnimationFrame(drawScene);
		}

		drawScene();
	}

	return parent;

}(BC || {}))

$(document).ready(function() {
	BC.Game.run();
});
