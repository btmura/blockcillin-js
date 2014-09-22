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

	me.make = function(args) {
		var CellContents = BC.Cell.CellContents;
		var CellState = BC.Cell.CellState;
		var Id = BC.Resources.Id;
		var GL = BC.GL;

		var NUM_FACES = 6;

		var gl = args.gl;
		var metrics = args.metrics;
		var resources = args.resources;

		var numSlices = metrics.numCells;
		var innerRadius = metrics.ringInnerRadius;
		var outerRadius = metrics.ringOuterRadius;
		var maxY = metrics.ringHeight / 2;
		var minY = -maxY;

		var theta = 2 * Math.PI / numSlices;
		var offset = (-Math.PI - theta) / 2;
		var innerCirclePoints = BC.Math.circlePoints(innerRadius, numSlices, offset);
		var outerCirclePoints = BC.Math.circlePoints(outerRadius, numSlices, offset);
		var zOffset = metrics.ringInnerRadius + (metrics.ringOuterRadius - metrics.ringInnerRadius) / 2;

		var i = 0;
		var p = 0;
		var np = p + 2;
		var points = []; // 3D points

		// TOP FACE

		points[i++] = innerCirclePoints[p];
		points[i++] = maxY;
		points[i++] = -innerCirclePoints[p + 1] - zOffset;

		points[i++] = outerCirclePoints[p];
		points[i++] = maxY;
		points[i++] = -outerCirclePoints[p + 1] - zOffset;

		points[i++] = outerCirclePoints[np];
		points[i++] = maxY;
		points[i++] = -outerCirclePoints[np + 1] - zOffset;

		points[i++] = innerCirclePoints[np];
		points[i++] = maxY;
		points[i++] = -innerCirclePoints[np + 1] - zOffset;

		// BOTTOM FACE

		points[i++] = outerCirclePoints[p];
		points[i++] = minY;
		points[i++] = -outerCirclePoints[p + 1] - zOffset;

		points[i++] = innerCirclePoints[p];
		points[i++] = minY;
		points[i++] = -innerCirclePoints[p + 1]  - zOffset;

		points[i++] = innerCirclePoints[np];
		points[i++] = minY;
		points[i++] = -innerCirclePoints[np + 1] - zOffset;

		points[i++] = outerCirclePoints[np];
		points[i++] = minY;
		points[i++] = -outerCirclePoints[np + 1] - zOffset;

		// LEFT FACE

		points[i++] = innerCirclePoints[p];
		points[i++] = maxY;
		points[i++] = -innerCirclePoints[p + 1] - zOffset;

		points[i++] = innerCirclePoints[p];
		points[i++] = minY;
		points[i++] = -innerCirclePoints[p + 1]  - zOffset;

		points[i++] = outerCirclePoints[p];
		points[i++] = minY;
		points[i++] = -outerCirclePoints[p + 1]  - zOffset;

		points[i++] = outerCirclePoints[p];
		points[i++] = maxY;
		points[i++] = -outerCirclePoints[p + 1]  - zOffset;

		// RIGHT FACE

		points[i++] = outerCirclePoints[np];
		points[i++] = maxY;
		points[i++] = -outerCirclePoints[np + 1] - zOffset;

		points[i++] = outerCirclePoints[np];
		points[i++] = minY;
		points[i++] = -outerCirclePoints[np + 1] - zOffset;

		points[i++] = innerCirclePoints[np];
		points[i++] = minY;
		points[i++] = -innerCirclePoints[np + 1] - zOffset;

		points[i++] = innerCirclePoints[np];
		points[i++] = maxY;
		points[i++] = -innerCirclePoints[np + 1] - zOffset;

		// OUTER FACE

		points[i++] = outerCirclePoints[p];
		points[i++] = maxY;
		points[i++] = -outerCirclePoints[p + 1] - zOffset;

		points[i++] = outerCirclePoints[p];
		points[i++] = minY;
		points[i++] = -outerCirclePoints[p + 1] - zOffset;

		points[i++] = outerCirclePoints[np];
		points[i++] = minY;
		points[i++] = -outerCirclePoints[np + 1] - zOffset;

		points[i++] = outerCirclePoints[np];
		points[i++] = maxY;
		points[i++] = -outerCirclePoints[np + 1] - zOffset;

		// INNER FACE

		points[i++] = innerCirclePoints[np];
		points[i++] = maxY;
		points[i++] = -innerCirclePoints[np + 1] - zOffset;

		points[i++] = innerCirclePoints[np];
		points[i++] = minY;
		points[i++] = -innerCirclePoints[np + 1] - zOffset;

		points[i++] = innerCirclePoints[p];
		points[i++] = minY;
		points[i++] = -innerCirclePoints[p + 1] - zOffset;

		points[i++] = innerCirclePoints[p];
		points[i++] = maxY;
		points[i++] = -innerCirclePoints[p + 1] - zOffset;

		var pointBuffer = GL.newArrayBuffer(gl, points);

		// Two dimensional array for tile x coordinates. Each face has the same texture coords.
		var textureIds = [
			Id.BLOCK_RED,
			Id.BLOCK_GREEN,
			Id.BLOCK_CYAN,
			Id.BLOCK_MAGENTA,
			Id.BLOCK_YELLOW,
			Id.BLOCK_BLUE,

			Id.BLOCK_INCOMING_RED,
			Id.BLOCK_INCOMING_GREEN,
			Id.BLOCK_INCOMING_CYAN,
			Id.BLOCK_INCOMING_MAGENTA,
			Id.BLOCK_INCOMING_YELLOW,
			Id.BLOCK_INCOMING_BLUE,

			Id.BLOCK_MARKED_RED,
			Id.BLOCK_MARKED_GREEN,
			Id.BLOCK_MARKED_CYAN,
			Id.BLOCK_MARKED_MAGENTA,
			Id.BLOCK_MARKED_YELLOW,
			Id.BLOCK_MARKED_BLUE,

			Id.EXPLOSION
		];

		var blockTextureMap = {};
		blockTextureMap[CellContents.BLOCK_RED] = 0;
		blockTextureMap[CellContents.BLOCK_GREEN] = 1;
		blockTextureMap[CellContents.BLOCK_CYAN] = 2;
		blockTextureMap[CellContents.BLOCK_MAGENTA] = 3;
		blockTextureMap[CellContents.BLOCK_YELLOW] = 4;
		blockTextureMap[CellContents.BLOCK_GREEN] = 5;
		blockTextureMap[CellContents.EXPLOSION] = 18;

		var incomingBlockTextureMap = {};
		incomingBlockTextureMap[CellContents.BLOCK_RED] = 6;
		incomingBlockTextureMap[CellContents.BLOCK_GREEN] = 7;
		incomingBlockTextureMap[CellContents.BLOCK_CYAN] = 8;
		incomingBlockTextureMap[CellContents.BLOCK_MAGENTA] = 9;
		incomingBlockTextureMap[CellContents.BLOCK_YELLOW] = 10;
		incomingBlockTextureMap[CellContents.BLOCK_GREEN] = 11;
		incomingBlockTextureMap[CellContents.EXPLOSION] = 18;

		var markedBlockTextureMap = {};
		markedBlockTextureMap[CellContents.BLOCK_RED] = 12;
		markedBlockTextureMap[CellContents.BLOCK_GREEN] = 13;
		markedBlockTextureMap[CellContents.BLOCK_CYAN] = 14;
		markedBlockTextureMap[CellContents.BLOCK_MAGENTA] = 15;
		markedBlockTextureMap[CellContents.BLOCK_YELLOW] = 16;
		markedBlockTextureMap[CellContents.BLOCK_GREEN] = 17;
		markedBlockTextureMap[CellContents.EXPLOSION] = 18;

		var textureCoordPoints = [];
		for (var i = 0; i < textureIds.length; i++) {
			var tile = resources.getTile(textureIds[i]);
			textureCoordPoints[i] = [];
			for (var j = 0, k = 0; j < NUM_FACES; j++) {
				// UPPER LEFT
				var tc = tile.textureCoord(0, 0);
				textureCoordPoints[i][k++] = tc[0];
				textureCoordPoints[i][k++] = tc[1];

				// LOWER LEFT
				tc = tile.textureCoord(0, 1);
				textureCoordPoints[i][k++] = tc[0];
				textureCoordPoints[i][k++] = tc[1];

				// LOWER RIGHT
				tc = tile.textureCoord(1, 1);
				textureCoordPoints[i][k++] = tc[0];
				textureCoordPoints[i][k++] = tc[1];

				// UPPER RIGHT
				tc = tile.textureCoord(1, 0);
				textureCoordPoints[i][k++] = tc[0];
				textureCoordPoints[i][k++] = tc[1];
			}
		}

		var textureCoordBuffers = [];
		for (var i = 0; i < textureIds.length; i++) {
			textureCoordBuffers[i] = GL.newArrayBuffer(gl, textureCoordPoints[i]);
		}

		var blockIndexBuffer = GL.newElementArrayBuffer(gl, [
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

		var explosionIndexBuffer = GL.newElementArrayBuffer(gl, [
			// OUTER RADIUS FACE
			16, 17, 18,
			16, 18, 19,

			// INNER RADIUS FACE
			20, 21, 22,
			20, 22, 23
		]);

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

			var textureCoordBuffer = getTextureCoordBuffer(cellDrawSpec);
			gl.bindBuffer(gl.ARRAY_BUFFER, textureCoordBuffer);
			gl.enableVertexAttribArray(textureCoordLocation);
			gl.vertexAttribPointer(textureCoordLocation, 2, gl.FLOAT, false, 0, 0);

			gl.uniform1f(yellowBoostLocation, cellDrawSpec.yellowBoost);
			gl.uniform1f(alphaLocation, cellDrawSpec.alpha);

			var indexBuffer = getIndexBuffer(cellDrawSpec);
			gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer.bufferId);
			gl.drawElements(gl.TRIANGLES, indexBuffer.count, gl.UNSIGNED_SHORT, 0);
		}

		function getTextureCoordBuffer(cellDrawSpec) {
			var textureIndexMap = getTextureIndexMap(cellDrawSpec);
			return textureCoordBuffers[textureIndexMap[cellDrawSpec.contents]];
		}

		function getTextureIndexMap(cellDrawSpec) {
			if (cellDrawSpec.state === CellState.BLOCK_CLEARING_FROZEN
					|| cellDrawSpec.state === CellState.BLOCK_CLEARING_READY) {
				return markedBlockTextureMap;
			} else if (cellDrawSpec.state === CellState.BLOCK_INCOMING) {
				return incomingBlockTextureMap;
			} else {
				return blockTextureMap;
			}
		}

		function getIndexBuffer(cellDrawSpec) {
			if (cellDrawSpec.contents === CellContents.EXPLOSION) {
				return explosionIndexBuffer;
			} else {
				return blockIndexBuffer;
			}
		}

		return {
			drawOpaque: drawOpaque,
			drawTransparent: drawTransparent
		};
	}

	return root;

}(BC || {}))