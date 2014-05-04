var BC = (function(parent) {

	var my = parent.Ring = parent.Ring || {}

	my.make = function(metrics, translationY) {
		var matrix = BC.Matrix.makeTranslation(0, translationY, 0);

		var cells = [];
		for (var i = 0; i < metrics.numCells; i++) {
			cells[i] = BC.Cell.make(i, metrics);
		}

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