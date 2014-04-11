var BC = (function(parent) {

	var my = parent.CellView = parent.CellView || {};

	my.make = function(gl, metrics, tiles) {
		var CellState = BC.Cell.CellState;

		var numSlices = metrics.numCells;
		var innerRadius = metrics.ringInnerRadius;
		var outerRadius = metrics.ringOuterRadius;
		var maxY = metrics.ringHeight / 2;
		var minY = -maxY;

		var offset = -Math.PI / 2;
		var innerCirclePoints = BC.Math.circlePoints(innerRadius, numSlices, offset);
		var outerCirclePoints = BC.Math.circlePoints(outerRadius, numSlices, offset);

		// Number of cube faces that will be drawn. No bottom cause nobody sees it.
		var numFaces = 5;

		var i = 0;
		var p = 0;
		var np = p + 2;
		var points = []; // 3D points

		// TOP FACE

		points[i++] = innerCirclePoints[p];
		points[i++] = maxY;
		points[i++] = -innerCirclePoints[p + 1];

		points[i++] = outerCirclePoints[p];
		points[i++] = maxY;
		points[i++] = -outerCirclePoints[p + 1];

		points[i++] = outerCirclePoints[np];
		points[i++] = maxY;
		points[i++] = -outerCirclePoints[np + 1];

		points[i++] = innerCirclePoints[np];
		points[i++] = maxY;
		points[i++] = -innerCirclePoints[np + 1];

		// LEFT FACE

		points[i++] = innerCirclePoints[p];
		points[i++] = maxY;
		points[i++] = -innerCirclePoints[p + 1];

		points[i++] = innerCirclePoints[p];
		points[i++] = minY;
		points[i++] = -innerCirclePoints[p + 1];

		points[i++] = outerCirclePoints[p];
		points[i++] = minY;
		points[i++] = -outerCirclePoints[p + 1];

		points[i++] = outerCirclePoints[p];
		points[i++] = maxY;
		points[i++] = -outerCirclePoints[p + 1];

		// RIGHT FACE

		points[i++] = outerCirclePoints[np];
		points[i++] = maxY;
		points[i++] = -outerCirclePoints[np + 1];

		points[i++] = outerCirclePoints[np];
		points[i++] = minY;
		points[i++] = -outerCirclePoints[np + 1];

		points[i++] = innerCirclePoints[np];
		points[i++] = minY;
		points[i++] = -innerCirclePoints[np + 1];

		points[i++] = innerCirclePoints[np];
		points[i++] = maxY;
		points[i++] = -innerCirclePoints[np + 1];

		// OUTER FACE

		points[i++] = outerCirclePoints[p];
		points[i++] = maxY;
		points[i++] = -outerCirclePoints[p + 1];

		points[i++] = outerCirclePoints[p];
		points[i++] = minY;
		points[i++] = -outerCirclePoints[p + 1];

		points[i++] = outerCirclePoints[np];
		points[i++] = minY;
		points[i++] = -outerCirclePoints[np + 1];

		points[i++] = outerCirclePoints[np];
		points[i++] = maxY;
		points[i++] = -outerCirclePoints[np + 1];

		// INNER FACE

		points[i++] = innerCirclePoints[np];
		points[i++] = maxY;
		points[i++] = -innerCirclePoints[np + 1];

		points[i++] = innerCirclePoints[np];
		points[i++] = minY;
		points[i++] = -innerCirclePoints[np + 1];

		points[i++] = innerCirclePoints[p];
		points[i++] = minY;
		points[i++] = -innerCirclePoints[p + 1];

		points[i++] = innerCirclePoints[p];
		points[i++] = maxY;
		points[i++] = -innerCirclePoints[p + 1];

		var pointBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, pointBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(points), gl.STATIC_DRAW);

		// Two dimensional array for tile x coordinates. Each face has the same texture coords.
		var textureCoords = [];
		for (var i = 0; i < tiles.length; i++) {
			var tile = tiles[i];
			textureCoords[i] = [];
			for (var j = 0, k = 0; j < numFaces; j++) {
				var tc = tile.textureCoord(0, 0);
				textureCoords[i][k++] = tc[0];
				textureCoords[i][k++] = tc[1];

				tc = tile.textureCoord(0, 1);
				textureCoords[i][k++] = tc[0];
				textureCoords[i][k++] = tc[1];

				tc = tile.textureCoord(1, 1);
				textureCoords[i][k++] = tc[0];
				textureCoords[i][k++] = tc[1];

				tc = tile.textureCoord(1, 0);
				textureCoords[i][k++] = tc[0];
				textureCoords[i][k++] = tc[1];
			}
		}

		var textureCoordBuffers = [];
		for (var i = 0; i < tiles.length; i++) {
			textureCoordBuffers[i] = gl.createBuffer();
			gl.bindBuffer(gl.ARRAY_BUFFER, textureCoordBuffers[i]);
			gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureCoords[i]), gl.STATIC_DRAW);
		}

		var indexArray = new Uint16Array([
			// TOP FACE
			0, 1, 2,
			0, 2, 3,

			// LEFT FACE
			4, 5, 6,
			4, 6, 7,

			// RIGHT FACE
			8, 9, 10,
			8, 10, 11,

			// OUTER RADIUS FACE
			12, 13, 14,
			12, 14, 15,

			// INNER RADIUS FACE
			16, 17, 18,
			16, 18, 19

		]);

		var indexBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
		gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indexArray, gl.STATIC_DRAW);

		var count = indexArray.length;

		function draw(cell, programLocations) {
			if (cell.state == CellState.NONE) {
				return;
			}

			var positionLocation = programLocations.positionLocation;
			var textureCoordLocation = programLocations.textureCoordLocation;
			var alphaLocation = programLocations.alphaLocation;

			gl.bindBuffer(gl.ARRAY_BUFFER, pointBuffer);
			gl.enableVertexAttribArray(positionLocation);
			gl.vertexAttribPointer(positionLocation, 3, gl.FLOAT, false, 0, 0);

			var textureCoordBuffer = textureCoordBuffers[cell.blockStyle];
			gl.bindBuffer(gl.ARRAY_BUFFER, textureCoordBuffer);
			gl.enableVertexAttribArray(textureCoordLocation);
			gl.vertexAttribPointer(textureCoordLocation, 2, gl.FLOAT, false, 0, 0);

			gl.uniform1f(alphaLocation, 1.0);

			gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
			gl.drawElements(gl.TRIANGLES, count, gl.UNSIGNED_SHORT, 0);
		}

		return {
			draw: draw
		};
	}

	return parent;

}(BC || {}))