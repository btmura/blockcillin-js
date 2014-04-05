var BC = (function(parent) {

	var my = parent.Cell = parent.Cell || {};

	my.make = function(gl, metrics, tiles) {
		var numSlices = metrics.numRingCells;
		var innerRadius = metrics.innerRingRadius;
		var outerRadius = metrics.outerRingRadius;
		var maxY = metrics.ringMaxY;
		var minY = metrics.ringMinY;

		var offset = -Math.PI / 2;
		var innerCirclePoints = BC.Math.circlePoints(innerRadius, numSlices, offset);
		var outerCirclePoints = BC.Math.circlePoints(outerRadius, numSlices, offset);

		var points = []; // 3D points

		var textureCoords = [];
		for (var i = 0; i < tiles.length; i++) {
			textureCoords[i] = [];
		}

		var setTextureCoords = function(tp, s1, t1, s2, t2, s3, t3) {
			for (var t = 0; t < tiles.length; t++) {
				var tile = tiles[t];

				var tc = tile.textureCoord(s1, t1);
				textureCoords[t][tp] = tc[0];
				textureCoords[t][tp + 1] = tc[1];

				tc = tile.textureCoord(s2, t2);
				textureCoords[t][tp + 2] = tc[0];
				textureCoords[t][tp + 3] = tc[1];

				tc = tile.textureCoord(s3, t3);
				textureCoords[t][tp + 4] = tc[0];
				textureCoords[t][tp + 5] = tc[1];
			}
			return tp + 6;
		};

		var i = 0;
		var j = 0;

		var p = 0;
		var np = p + 2;

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

		j = setTextureCoords(j, 0, 0, 0, 1, 1, 1);

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

		j = setTextureCoords(j, 0, 0, 1, 1, 1, 0);

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

		j = setTextureCoords(j, 0, 0, 1, 1, 0, 1);

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

		j = setTextureCoords(j, 0, 0, 1, 0, 1, 1);

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

		j = setTextureCoords(j, 0, 1, 1, 1, 1, 0);

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

		j = setTextureCoords(j, 0, 1, 1, 0, 0, 0);

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

		j = setTextureCoords(j, 0, 1, 1, 0, 1, 1);

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

		j = setTextureCoords(j, 0, 1, 0, 0, 1, 0);

		var pointBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, pointBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(points), gl.STATIC_DRAW);

		var triangleCount = points.length / 3;

		var textureCoordBuffers = [];
		for (var i = 0; i < tiles.length; i++) {
			textureCoordBuffers[i] = gl.createBuffer();
			gl.bindBuffer(gl.ARRAY_BUFFER, textureCoordBuffers[i]);
			gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureCoords[i]), gl.STATIC_DRAW);
		}

		function draw(cell, positionLocation, textureCoordLocation) {
			gl.bindBuffer(gl.ARRAY_BUFFER, pointBuffer);
			gl.enableVertexAttribArray(positionLocation);
			gl.vertexAttribPointer(positionLocation, 3, gl.FLOAT, false, 0, 0);

			var textureCoordBuffer = textureCoordBuffers[cell.blockStyle];

			gl.bindBuffer(gl.ARRAY_BUFFER, textureCoordBuffer);
			gl.enableVertexAttribArray(textureCoordLocation);
			gl.vertexAttribPointer(textureCoordLocation, 2, gl.FLOAT, false, 0, 0);

			gl.drawArrays(gl.TRIANGLES, 0, triangleCount);
		}

		return {
			draw: draw
		};
	}

	return parent;

}(BC || {}))