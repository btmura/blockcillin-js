var BC = (function(root) {

	var parent = root.Common = root.Common || {};
	var me = parent.GL = parent.GL || {};

	/**
	 * Loads a shader from a script tag.
	 *
	 * @param {WebGLContext} gl - the WebGLContext to use
	 * @param {string} scriptId - id of the script tag
	 * @param {number} shaderType - type of the shader
	 * @param {function(string): void} opt_errorCallback - callback for errors
	 * @return {WebGLShader} the created shader
	 */
	me.loadShader = function(gl, scriptId, shaderType, opt_errorCallback) {
		var errFn = opt_errorCallback || BC.Common.Log.error;
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
	};

	me.createProgram = function(gl, shaders, opt_attribs, opt_locations) {
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
			BC.Common.Log.error("Error in program linking: " + lastError);

			gl.deleteProgram(program);
			return null;
		}
		return program;
	};

	/**
	 * Returns a tile set representing a texture split up into multiple.
	 *
	 * @param {number} numRows - rows the tile map has
	 * @param {number} numCols - columns the tile map has
	 * @param {number} inset - amount to inset from 0 to 1
	 * @return {Object} the tile map to query for tiles
	 */
	me.textureTileSet = function(numRows, numCols, inset) {
		var tw = 1.0 / numRows;
		var th = 1.0 / numCols;
		return {

			/**
			 * Returns the tile at a certain row and column.
			 *
			 * @param {number} row - zero-based index from top
			 * @param {number} col - zero-based index from left
			 * @return {Object} the tile at that row and column
			 */
			tile : function(row, col) {
				var tx = tw * col;
				var ty = th * row;
				return {

					/**
					 * Translates the relative position to absolute position.
					 *
					 * @param {number} s - s coord from left as if one texture
					 * @param {number} t - t coord from top as if one texture
					 */
					textureCoord : function(s, t) {
						return [
							tx + inset + (tw - inset*2) * s,
							ty + inset + (th - inset*2) * t
						];
					}
				};
			}
		};
	};

	return root;

}(BC || {}))