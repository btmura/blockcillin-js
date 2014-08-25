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

	var parent = root.Selector = root.Selector || {};
	var me = parent.View = parent.View || {};

	me.make = function(args) {
		var gl = args.gl;
		var metrics = args.metrics;
		var programLocations = args.programLocations;
		var textureTile = args.textureTile;

		var selectorMatrixLocation = programLocations.selectorMatrixLocation;
		var positionLocation = programLocations.positionLocation;
		var textureCoordLocation = programLocations.textureCoordLocation;
		var alphaLocation = programLocations.alphaLocation;

		var minY = -metrics.ringHeight / 2;
		var maxY = -minY;
		var outerRadius = metrics.ringOuterRadius + 0.01;
		var outerCirclePoints = BC.Math.circlePoints(outerRadius, metrics.numCells, -Math.PI / 2);

		var lp = outerCirclePoints.length - 2;
		var mp = 0;
		var rp = 2;

		// Add padding to put selector in front of the blocks.
		var padding = 0.001;

		var points = [];
		var i = 0;

		// Left square - counter clockwise from lower left

		points[i++] = outerCirclePoints[lp] + padding;
		points[i++] = minY;
		points[i++] = -outerCirclePoints[lp + 1] - padding;

		points[i++] = outerCirclePoints[mp] + padding;
		points[i++] = minY;
		points[i++] = -outerCirclePoints[mp + 1] - padding;

		points[i++] = outerCirclePoints[mp] + padding;
		points[i++] = maxY;
		points[i++] = -outerCirclePoints[mp + 1] - padding;

		points[i++] = outerCirclePoints[lp] + padding;
		points[i++] = maxY;
		points[i++] = -outerCirclePoints[lp + 1] - padding;

		// Right square

		points[i++] = outerCirclePoints[mp] + padding;
		points[i++] = minY;
		points[i++] = -outerCirclePoints[mp + 1] - padding;

		points[i++] = outerCirclePoints[rp] + padding;
		points[i++] = minY;
		points[i++] = -outerCirclePoints[rp + 1] - padding;

		points[i++] = outerCirclePoints[rp] + padding;
		points[i++] = maxY;
		points[i++] = -outerCirclePoints[rp + 1] - padding;

		points[i++] = outerCirclePoints[mp] + padding;
		points[i++] = maxY;
		points[i++] = -outerCirclePoints[mp + 1] - padding;

		var pointBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, pointBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(points), gl.STATIC_DRAW);

		// Map the four corners of the texture title.
		var ll = textureTile.textureCoord(0, 0);
		var lr = textureTile.textureCoord(1, 0);
		var ur = textureTile.textureCoord(1, 1);
		var ul = textureTile.textureCoord(0, 1);

		var textureCoords = new Float32Array([].concat(ll, lr, ur, ul, ll, lr, ur, ul));

		var textureCoordBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, textureCoordBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, textureCoords, gl.STATIC_DRAW);

		var indices = new Uint16Array([
			0, 1, 2,
			0, 2, 3,

			4, 5, 6,
			4, 6, 7
		]);

		var indexBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
		gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);

		function draw() {
			gl.bindBuffer(gl.ARRAY_BUFFER, pointBuffer);
			gl.enableVertexAttribArray(positionLocation);
			gl.vertexAttribPointer(positionLocation, 3, gl.FLOAT, false, 0, 0);

			gl.bindBuffer(gl.ARRAY_BUFFER, textureCoordBuffer);
			gl.enableVertexAttribArray(textureCoordLocation);
			gl.vertexAttribPointer(textureCoordLocation, 2, gl.FLOAT, false, 0, 0);

			gl.uniform1f(alphaLocation, 1.0);

			gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
			gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0);
		}

		return {
			draw: draw
		};
	}

	return root;

}(BC || {}))