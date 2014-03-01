var error = function(msg) {
	if (window.console) {
		if (window.console.error) {
			window.console.error(msg);
		} else if (window.console.log) {
			window.console.log(msg);
		}
	}
};

var loadShader = function(gl, shaderSource, shaderType, opt_errorCallback) {
	var errFn = opt_errorCallback || error;
	var shader = gl.createShader(shaderType);

	gl.shaderSource(shader, shaderSource);

	gl.compileShader(shader);

	var compiled = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
	if (!compiled) {
		lastError = gl.getShaderInfoLog(shader);
		errFn("*** Error compiling shader '" + shader + "':" + lastError);
		gl.deleteShader(shader);
		return null;
	}

	return shader;
};

var createProgram = function(gl, shaders, opt_attribs, opt_locations) {
	var program = gl.createProgram();
	for (var i = 0; i < shaders.length; i++) {
		gl.attachShader(program, shaders[i]);
	}
	if (opt_attribs) {
		for (var i = 0; i < opt_attribs.length; i++) {
			gl.bindAttribLocation(
					program,
					opt_locations ? opt_locations[i] : i,
					opt_attribs[i]);
		}
	}
	gl.linkProgram(program);

	var linked = gl.getProgramParameter(program, gl.LINK_STATUS);
	if (!linked) {
		lastError = gl.getProgramInfoLog(program);
		error("Error in program linking: " + lastError);

		gl.deleteProgram(program);
		return null;
	}
	return program;
};

function getTimeInSeconds() {
  return Date.now() * 0.001;
}

$(document).ready(function() {
	var canvas = document.getElementById("canvas");
	var gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
	if (!gl) {
		return;
	}

	gl.enable(gl.CULL_FACE);
	gl.enable(gl.DEPTH_TEST);

	var vertexShader;
	var fragmentShader;
	$.when(
		$.get('/glsl/vertex.glsl', function(shaderSource) {
			vertexShader = loadShader(gl, shaderSource, gl.VERTEX_SHADER);
		}),
		$.get('/glsl/fragment.glsl', function(shaderSource) {
			fragmentShader = loadShader(gl, shaderSource, gl.FRAGMENT_SHADER);
		})
	).then(loadShaderSourceSuccess);

	function loadShaderSourceSuccess() {
		var program = createProgram(gl, [vertexShader, fragmentShader]);
		gl.useProgram(program);

		var positionLocation = gl.getAttribLocation(program, "a_position");
		var colorLocation = gl.getAttribLocation(program, "a_color");
		var matrixLocation = gl.getUniformLocation(program, "u_matrix");

		var radians = function(degrees) {
			return degrees * Math.PI / 180;
		}

		var then = getTimeInSeconds();

		var rotationSpeed = 1;
		var rotation = [radians(0), radians(0), radians(0)];

		function drawScene() {
			var now = getTimeInSeconds();
			var deltaTime = now - then;
			then = now;

			rotation[1] += rotationSpeed * deltaTime;

			var translation = [0, 0, 0];
			var scale = [1, 1, 1];

			var scaleMatrix = makeScale(scale[0], scale[1], scale[2]);
			var rotationZMatrix = makeZRotation(rotation[2]);
			var rotationYMatrix = makeYRotation(rotation[1]);
			var rotationXMatrix = makeXRotation(rotation[0]);
			var translationMatrix = makeTranslation(translation[0], translation[1], translation[2]);

			var up = [0, 1, 0];
			var cameraPosition = [3, 3, 3];
			var targetPosition = [0, 0, 0];
			var cameraMatrix = makeLookAt(cameraPosition, targetPosition, up);
			var viewMatrix = makeInverse(cameraMatrix);

			var aspect = canvas.width / canvas.height;
			var fieldOfViewRadians = radians(55);
			var projectionMatrix = makePerspective(fieldOfViewRadians, aspect, 1, 2000);

			var matrix = matrixMultiply(scaleMatrix, rotationZMatrix);
			matrix = matrixMultiply(matrix, rotationYMatrix);
			matrix = matrixMultiply(matrix, rotationXMatrix);
			matrix = matrixMultiply(matrix, translationMatrix);
			matrix = matrixMultiply(matrix, viewMatrix);
			matrix = matrixMultiply(matrix, projectionMatrix);

			var buffer = gl.createBuffer();
			gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
			gl.bufferData(
				gl.ARRAY_BUFFER,
				new Float32Array([
					// Red
					-1, 1, 1,
					-1, -1, 1,
					1, -1, 1,

					-1, 1, 1,
					1, -1, 1,
					1, 1, 1,

					// Blue
					1, 1, 1,
					1, -1, 1,
					1, -1, -1,

					1, 1, 1,
					1, -1, -1,
					1, 1, -1,

					// Green
					-1, 1, 1,
					1, 1, -1,
					-1, 1, -1,

					-1, 1, 1,
					1, 1, 1,
					1, 1, -1
				]),
				gl.STATIC_DRAW);
			gl.enableVertexAttribArray(positionLocation);
			gl.vertexAttribPointer(positionLocation, 3, gl.FLOAT, false, 0, 0);
			gl.uniformMatrix4fv(matrixLocation, false, matrix);

			var colorBuffer = gl.createBuffer();
			gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
			gl.bufferData(
				gl.ARRAY_BUFFER,
				new Uint8Array([
					255, 0, 0,
					255, 0, 0,
					255, 0, 0,

					255, 0, 0,
					255, 0, 0,
					255, 0, 0,

					0, 0, 255,
					0, 0, 255,
					0, 0, 255,

					0, 0, 255,
					0, 0, 255,
					0, 0, 255,

					0, 255, 0,
					0, 255, 0,
					0, 255, 0,

					0, 255, 0,
					0, 255, 0,
					0, 255, 0
				]),
				gl.STATIC_DRAW);
			gl.enableVertexAttribArray(colorLocation);
			gl.vertexAttribPointer(colorLocation, 3, gl.UNSIGNED_BYTE, true, 0, 0);

			gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
			gl.drawArrays(gl.TRIANGLES, 0, 18);

			requestAnimationFrame(drawScene);
		}

		drawScene();
	}
});
