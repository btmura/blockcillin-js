var BC = (function(parent) {

	var my = parent.Ring = parent.Ring || {}

	my.make = function(metrics, translationY) {
		// How much to rotate each cell by to form a ring of cells.
		var RING_ROTATION_Y_DELTA = BC.Math.sliceRadians(metrics.numCells);

		var matrix = BC.Matrix.makeTranslation(0, translationY, 0);

		var cells = [];
		for (var i = 0; i < metrics.numCells; i++) {
			var rotationY = i * RING_ROTATION_Y_DELTA;
			cells[i] = BC.Cell.make(metrics, rotationY);
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