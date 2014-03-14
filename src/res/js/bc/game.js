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
		var cameraPosition = [0, 5, 5];
		var targetPosition = [0, 0, 0];
		var cameraMatrix = BC.Matrix.makeLookAt(cameraPosition, targetPosition, up);
		var viewMatrix = BC.Matrix.makeInverse(cameraMatrix);

		var aspect = canvas.width / canvas.height;
		var fieldOfViewRadians = BC.Math.radians(55);
		var projectionMatrix = BC.Matrix.makePerspective(fieldOfViewRadians, aspect, 1, 2000);

		var texture = gl.createTexture();
		gl.bindTexture(gl.TEXTURE_2D, texture);
		// Fill the texture with a 1x1 blue pixel.
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE,
              new Uint8Array([0, 0, 255, 255]));

		var image = new Image();
		image.src = "images/texture.png";
		image.addEventListener('load', function() {
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

		function drawScene() {
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
			gl.bufferData(
				gl.ARRAY_BUFFER,
				new Float32Array([
					// Front
					-1, 1, 1,
					-1, -1, 1,
					1, -1, 1,

					-1, 1, 1,
					1, -1, 1,
					1, 1, 1,

					// Right
					1, 1, 1,
					1, -1, 1,
					1, -1, -1,

					1, 1, 1,
					1, -1, -1,
					1, 1, -1,

					// Top
					-1, 1, 1,
					1, 1, -1,
					-1, 1, -1,

					-1, 1, 1,
					1, 1, 1,
					1, 1, -1,

					// Back
					-1, 1, -1,
					1, -1, -1,
					-1, -1, -1,

					-1, 1, -1,
					1, 1, -1,
					1, -1, -1,

					// Left
					-1, 1, 1,
					-1, -1, -1,
					-1, -1, 1,

					-1, 1, 1,
					-1, 1, -1,
					-1, -1, -1,

					// Bottom
					-1, -1, 1,
					-1, -1, -1,
					1, -1, -1,

					-1, -1, 1,
					1, -1, -1,
					1, -1, 1
				]),
				gl.STATIC_DRAW);
			gl.enableVertexAttribArray(positionLocation);
			gl.vertexAttribPointer(positionLocation, 3, gl.FLOAT, false, 0, 0);
			gl.uniformMatrix4fv(matrixLocation, false, matrix);

			var textureBuffer = gl.createBuffer();
			gl.bindBuffer(gl.ARRAY_BUFFER, textureBuffer);
			gl.enableVertexAttribArray(texcoordLocation);
			gl.vertexAttribPointer(texcoordLocation, 2, gl.FLOAT, false, 0, 0);
			gl.bufferData(
				gl.ARRAY_BUFFER,
				new Float32Array([
					// Front
					0, 0,
					0, 1,
					1, 1,

					0, 0,
					1, 1,
					1, 0,

					// Right
					0, 0,
					0, 1,
					1, 1,

					0, 0,
					1, 1,
					1, 0,

					// Top
					0, 1,
					1, 0,
					0, 0,

					0, 1,
					1, 1,
					1, 0,

					// Back
					1, 0,
					0, 1,
					1, 1,

					1, 0,
					0, 0,
					0, 1,

					// Left
					1, 0,
					0, 1,
					1, 1,

					1, 0,
					0, 0,
					0, 1,

					// Bottom
					0, 1,
					0, 0,
					1, 0,

					0, 1,
					1, 0,
					1, 1
				]),
				gl.STATIC_DRAW);

			gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
			gl.drawArrays(gl.TRIANGLES, 0, 6 * 6);

			requestAnimationFrame(drawScene);
		}

		drawScene();
	}

	return parent;

}(BC || {}))

$(document).ready(function() {
	BC.Game.run();
});
