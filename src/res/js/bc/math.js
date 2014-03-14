var BC = (function(parent) {

	var my = parent.Math = parent.Math || {};

	/**
	 * Converts degrees into radians.
	 *
	 * @param {Number} degrees - degrees to convert to radians
	 * @returns {@number} equivalent radians
	 */
	my.radians = function(degrees) {
		return  degrees * Math.PI / 180;
	}

	/**
	 * Return array of points on a circle.
	 *
	 * @param {Number} radius - radius of the circle
	 * @param {Number} count - number of points on the circle
	 * @returns {Array} array with x and y values
	 */
	my.circlePoints = function(radius, count) {
		var theta = 2 * Math.PI / count;
		var points = [];
		for (var i = 0; i < count; i++) {
			points[i * 2] = radius * Math.cos(i * theta);
			points[i * 2 + 1] = radius * Math.sin(i * theta);
		}
		return points;
	}

	my.cross = function(a, b) {
		return [
			a[1] * b[2] - a[2] * b[1],
			a[2] * b[0] - a[0] * b[2],
			a[0] * b[1] - a[1] * b[0]
		];
	}

	my.subtractVectors = function(a, b) {
		return [
			a[0] - b[0],
			a[1] - b[1],
			a[2] - b[2]
		];
	}

	my.normalize = function(v) {
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

	return parent;

}(BC || {}))
