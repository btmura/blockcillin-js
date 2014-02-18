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

$(document).ready(function() {
	var canvas = document.getElementById("canvas");
	var gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
	// TODO(btmura): handle situation where WebGL is not available

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
		var matrixLocation = gl.getUniformLocation(program, "u_matrix");
		var colorLocation = gl.getUniformLocation(program, "u_color");

		var radians = function(degrees) {
			return degrees * Math.PI / 180;
		}

		var translation = [-50, 0, 0];
		var rotation = [radians(0), radians(0), radians(0)];
		var scale = [1, 0.5, 1];

		var projectionMatrix = makeProjection(canvas.width, canvas.height, canvas.width);
		var translationMatrix = makeTranslation(translation[0], translation[1], translation[2]);
		var rotationXMatrix = makeXRotation(rotation[0]);
		var rotationYMatrix = makeYRotation(rotation[1]);
		var rotationZMatrix = makeZRotation(rotation[2]);
		var scaleMatrix = makeScale(scale[0], scale[1], scale[2]);

		var matrix = matrixMultiply(scaleMatrix, rotationZMatrix);
		matrix = matrixMultiply(matrix, rotationYMatrix);
		matrix = matrixMultiply(matrix, rotationXMatrix);
		matrix = matrixMultiply(matrix, translationMatrix);
		matrix = matrixMultiply(matrix, projectionMatrix);

		var w = canvas.width
		var h = canvas.height
		var d = canvas.width

		var buffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
		gl.bufferData(
				gl.ARRAY_BUFFER,
				new Float32Array([
					w / 2, 0, 0,
					0, -h, 0,
					w, -h, 0
					]),
				gl.STATIC_DRAW);
		gl.enableVertexAttribArray(positionLocation);
		gl.vertexAttribPointer(positionLocation, 3, gl.FLOAT, false, 0, 0);
		gl.uniformMatrix4fv(matrixLocation, false, matrix);
		gl.uniform3f(colorLocation, 1, 0, 0);
		gl.drawArrays(gl.TRIANGLES, 0, 3);
	}
});
