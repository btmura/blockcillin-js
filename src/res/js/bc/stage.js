var BC = (function(parent) {

	var my = parent.Stage = parent.Stage || {}

	my.make = function(metrics) {
		var translation = [0, 0, 0];
		translation[1] -= metrics.numRings * metrics.ringHeight;
		translation[1] += metrics.ringHeight / 2;

		var matrix = BC.Matrix.makeTranslation(
				translation[0],
				translation[1],
				translation[2]);

		return {
			matrix: matrix
		};
	};

	return parent;

}(BC || {}))