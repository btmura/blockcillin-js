var BC = (function(parent) {

	var my = parent.Ring = parent.Ring || {}

	my.make = function(ringIndex, metrics) {
		var cells = [];
		for (var i = 0; i < metrics.numCells; i++) {
			cells[i] = BC.Cell.make(i, metrics);
		}

		var translationY = -ringIndex * metrics.ringHeight;
		var matrix = BC.Matrix.makeTranslation(0, translationY, 0);

		return {
			cells: cells,
			matrix: matrix
		};
	};

	return parent;

}(BC || {}))