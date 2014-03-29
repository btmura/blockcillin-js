var BC = (function(parent) {

	var my = parent.Selector = parent.Selector || {};

	my.makeSelector = function(gl) {
		var points = new Float32Array([
			0, 0, 0,
			1, 0, 0,
			1, 1, 0,
		]);

		var pointBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, pointBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, points, gl.STATIC_DRAW);

		var textureCoords = new Float32Array([
			0, 0,
			1, 0,
			1, 1
		]);

		var textureCoordBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, textureCoordBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, textureCoords, gl.STATIC_DRAW);

		function draw(positionLocation, textureCoordLocation) {
			gl.bindBuffer(gl.ARRAY_BUFFER, pointBuffer);
			gl.enableVertexAttribArray(positionLocation);
			gl.vertexAttribPointer(positionLocation, 3, gl.FLOAT, false, 0, 0);

			gl.bindBuffer(gl.ARRAY_BUFFER, textureCoordBuffer);
			gl.enableVertexAttribArray(textureCoordLocation);
			gl.vertexAttribPointer(textureCoordLocation, 2, gl.FLOAT, false, 0, 0);

			gl.drawArrays(gl.TRIANGLES, 0, points.length / 3);
		}

		return {
			draw: draw
		};
	}

	return parent;

}(BC || {}))