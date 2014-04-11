var BC = (function(parent) {

	var my = parent.Ring = parent.Ring || {}

	my.make = function(ringIndex, metrics) {
		var cells = [];
		for (var i = 0; i < metrics.numCells; i++) {
			cells[i] = BC.Cell.make(i, metrics);
		}

		var translationY = -ringIndex * metrics.ringHeight;
		var matrix = BC.Matrix.makeTranslation(0, translationY, 0);

		function update(deltaTime) {
			for (var i = 0; i < cells.length; i++) {
				cells[i].update(deltaTime);
			}
		}

		return {
			cells: cells,
			matrix: matrix,
			update: update
		};
	};

	return parent;

}(BC || {}))