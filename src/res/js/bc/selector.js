var BC = (function(parent) {

	var my = parent.Selector = parent.Selector || {};

	my.makeSelector = function(gl, textureTile) {
		var points = new Float32Array([
			0, 0, 0,
			1, 0, 0,
			1, 1, 0,
			0, 1, 0
		]);

		var pointBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, pointBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, points, gl.STATIC_DRAW);

		var tc1 = textureTile.textureCoord(0, 0);
		var tc2 = textureTile.textureCoord(1, 0);
		var tc3 = textureTile.textureCoord(1, 1);
		var tc4 = textureTile.textureCoord(0, 1);
		var textureCoords = new Float32Array(tc1.concat(tc2).concat(tc3).concat(tc4));

		var textureCoordBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, textureCoordBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, textureCoords, gl.STATIC_DRAW);

		var indices = new Uint16Array([
			0, 1, 2,
			0, 2, 3
		]);

		var indexBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
		gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);

		function draw(positionLocation, textureCoordLocation) {
			gl.bindBuffer(gl.ARRAY_BUFFER, pointBuffer);
			gl.enableVertexAttribArray(positionLocation);
			gl.vertexAttribPointer(positionLocation, 3, gl.FLOAT, false, 0, 0);

			gl.bindBuffer(gl.ARRAY_BUFFER, textureCoordBuffer);
			gl.enableVertexAttribArray(textureCoordLocation);
			gl.vertexAttribPointer(textureCoordLocation, 2, gl.FLOAT, false, 0, 0);

			gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
			gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0);
		}

		return {
			draw: draw
		};
	}

	return parent;

}(BC || {}))