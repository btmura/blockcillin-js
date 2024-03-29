/*
 * Copyright (C) 2014  Brian Muramatsu
 *
 * This file is part of blockcillin.
 *
 * blockcillin is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * blockcillin is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with blockcillin.  If not, see <http://www.gnu.org/licenses/>.
 */

var BC = (function(root) {

	var me = root.GL = root.GL || {};

	// Loads a shader from a script tag.
	me.loadShader = function(gl, scriptId, shaderType, opt_errorCallback) {
		var errFn = opt_errorCallback || BC.Log.error;
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
			BC.Log.error("Error in program linking: " + lastError);

			gl.deleteProgram(program);
			return null;
		}
		return program;
	};

	// Returns a tile set representing a texture split up into multiple.
	me.textureTileSet = function(numRows, numCols, inset) {
		var tw = 1.0 / numRows;
		var th = 1.0 / numCols;
		return {

			// Returns the tile at a certain row and column.
			tile : function(row, col) {
				var tx = tw * col;
				var ty = th * row;
				return {

					// Translates the relative position to absolute position.
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

	me.newArrayBuffer = function(gl, bufferData) {
		var bufferId = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, bufferId);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(bufferData), gl.STATIC_DRAW);
		return bufferId;
	};

	me.newElementArrayBuffer = function(gl, bufferData) {
		var bufferId = gl.createBuffer();
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, bufferId);
		gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(bufferData), gl.STATIC_DRAW);
		return {
			bufferId: bufferId,
			count: bufferData.length
		};
	};

	return root;

}(BC || {}))