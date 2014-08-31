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

	var parent = root.Cell = root.Cell || {};
	var me = parent.View = parent.View || {};

	me.make = function(gl, metrics, tiles) {
		var CellState = BC.Cell.CellState;

		var NUM_FACES = 6;

		var numSlices = metrics.numCells;
		var innerRadius = metrics.ringInnerRadius;
		var outerRadius = metrics.ringOuterRadius;
		var maxY = metrics.ringHeight / 2;
		var minY = -maxY;

		var offset = -Math.PI / 2;
		var innerCirclePoints = BC.Math.circlePoints(innerRadius, numSlices, offset);
		var outerCirclePoints = BC.Math.circlePoints(outerRadius, numSlices, offset);

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

		// BOTTOM FACE

		points[i++] = outerCirclePoints[p];
		points[i++] = minY;
		points[i++] = -outerCirclePoints[p + 1];

		points[i++] = innerCirclePoints[p];
		points[i++] = minY;
		points[i++] = -innerCirclePoints[p + 1];

		points[i++] = innerCirclePoints[np];
		points[i++] = minY;
		points[i++] = -innerCirclePoints[np + 1];

		points[i++] = outerCirclePoints[np];
		points[i++] = minY;
		points[i++] = -outerCirclePoints[np + 1];

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
			for (var j = 0, k = 0; j < NUM_FACES; j++) {
				// UPPER LEFT
				var tc = tile.textureCoord(0, 0);
				textureCoords[i][k++] = tc[0];
				textureCoords[i][k++] = tc[1];

				// LOWER LEFT
				tc = tile.textureCoord(0, 1);
				textureCoords[i][k++] = tc[0];
				textureCoords[i][k++] = tc[1];

				// LOWER RIGHT
				tc = tile.textureCoord(1, 1);
				textureCoords[i][k++] = tc[0];
				textureCoords[i][k++] = tc[1];

				// UPPER RIGHT
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

			// BOTTOM FACE
			4, 5, 6,
			4, 6, 7,

			// LEFT FACE
			8, 9, 10,
			8, 10, 11,

			// RIGHT FACE
			12, 13, 14,
			12, 14, 15,

			// OUTER RADIUS FACE
			16, 17, 18,
			16, 18, 19,

			// INNER RADIUS FACE
			20, 21, 22,
			20, 22, 23

		]);

		var indexBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
		gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indexArray, gl.STATIC_DRAW);

		var count = indexArray.length;

		function drawOpaque(cellDrawSpec, programLocations) {
			if (cellDrawSpec.isDrawable && !cellDrawSpec.isTransparent) {
				drawCell(cellDrawSpec, programLocations);
			}
		}

		function drawTransparent(cellDrawSpec, programLocations) {
			if (cellDrawSpec.isDrawable && cellDrawSpec.isTransparent) {
				gl.disable(gl.CULL_FACE);
				drawCell(cellDrawSpec, programLocations);
				gl.enable(gl.CULL_FACE);
			}
		}

		function drawCell(cellDrawSpec, programLocations) {
			var positionLocation = programLocations.positionLocation;
			var textureCoordLocation = programLocations.textureCoordLocation;
			var yellowBoostLocation = programLocations.yellowBoostLocation;
			var alphaLocation = programLocations.alphaLocation;

			gl.bindBuffer(gl.ARRAY_BUFFER, pointBuffer);
			gl.enableVertexAttribArray(positionLocation);
			gl.vertexAttribPointer(positionLocation, 3, gl.FLOAT, false, 0, 0);

			var textureCoordBuffer = textureCoordBuffers[cellDrawSpec.blockStyle];
			gl.bindBuffer(gl.ARRAY_BUFFER, textureCoordBuffer);
			gl.enableVertexAttribArray(textureCoordLocation);
			gl.vertexAttribPointer(textureCoordLocation, 2, gl.FLOAT, false, 0, 0);

			gl.uniform1f(yellowBoostLocation, cellDrawSpec.yellowBoost);
			gl.uniform1f(alphaLocation, cellDrawSpec.alpha);

			gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
			gl.drawElements(gl.TRIANGLES, count, gl.UNSIGNED_SHORT, 0);
		}

		return {
			drawOpaque: drawOpaque,
			drawTransparent: drawTransparent
		};
	}

	return root;

}(BC || {}))