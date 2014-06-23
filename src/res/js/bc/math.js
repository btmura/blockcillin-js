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

	var me = root.Math = root.Math || {};

	/**
	 * Converts degrees into radians.
	 *
	 * @param {Number} degrees - degrees to convert to radians
	 * @returns {@number} equivalent radians
	 */
	me.radians = function(degrees) {
		return  degrees * Math.PI / 180;
	}

	me.sliceRadians = function(numSlices) {
		return 2 * Math.PI / numSlices;
	}

	/**
	 * Returns a random integer between 0 and max exclusive.
	 *
	 * @param {Number} max - the max exclusive upper bound
	 */
	me.randomInt = function(max) {
		return Math.floor(Math.random() * max);
	}

	/**
	 * Return array of points on a circle.
	 *
	 * @param {Number} radius - radius of the circle
	 * @param {Number} count - number of points on the circle
	 * @param {Number} offset - starting radian offset
	 * @returns {Array} array with x and y values
	 */
	me.circlePoints = function(radius, count, offset) {
		offset = offset || 0;
		var theta = 2 * Math.PI / count;
		var points = [];
		for (var i = 0; i < count; i++) {
			points[i * 2] = radius * Math.cos(offset + i * theta);
			points[i * 2 + 1] = radius * Math.sin(offset + i * theta);
		}
		return points;
	}

	me.cross = function(a, b) {
		return [
			a[1] * b[2] - a[2] * b[1],
			a[2] * b[0] - a[0] * b[2],
			a[0] * b[1] - a[1] * b[0]
		];
	}

	me.subtractVectors = function(a, b) {
		return [
			a[0] - b[0],
			a[1] - b[1],
			a[2] - b[2]
		];
	}

	me.normalize = function(v) {
		var length = Math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2]);
		// make sure we don't divide by 0.
		if (length > 0.00001) {
			return [
				v[0] / length,
				v[1] / length,
				v[2] / length
			]
		} else {
			return [0, 0, 0];
		}
	}

	return root;

}(BC || {}))
