var BC = (function(parent) {

	var my = parent.GL = parent.GL || {}

	/**
	 * Loads a shader from a script tag.
	 *
	 * @param {WebGLContext} gl - the WebGLContext to use
	 * @param {string} scriptId - id of the script tag
	 * @param {number} shaderType - type of the shader
	 * @param {function(string): void} opt_errorCallback - callback for errors
	 * @return {WebGLShader} the created shader
	 */
	my.loadShader = function(gl, scriptId, shaderType, opt_errorCallback) {
		var errFn = opt_errorCallback || BC.Util.error;
		var shaderScript = document.getElementById(scriptId);
		if (!shaderScript) {
			errFn("** Error getting script element:" + scriptId);
			return null;
		}

		var shader = gl.createShader(shaderType);
		var shaderSource = shaderScript.text;
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
	}

	my.createProgram = function(gl, shaders, opt_attribs, opt_locations) {
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
	}

	return parent;

}(BC || {}))