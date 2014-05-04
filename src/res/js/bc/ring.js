var BC = (function(parent) {

	var my = parent.Ring = parent.Ring || {}

	my.make = function(ringIndex, metrics) {
		var cells = [];
		for (var i = 0; i < metrics.numCells; i++) {
			cells[i] = BC.Cell.make(i, metrics);
		}

		var translationY = -ringIndex * metrics.ringHeight;
		var matrix = BC.Matrix.makeTranslation(0, translationY, 0);

		function isEmpty() {
			for (var i = 0; i < cells.length; i++) {
				if (cells[i].state !== BC.Cell.CellState.EMPTY) {
					return false;
				}
			}

			return true;
		}

		return {
			matrix: matrix,
			cells: cells,
			isEmpty: isEmpty
		};
	};

	return parent;

}(BC || {}))