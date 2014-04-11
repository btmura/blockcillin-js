var BC = (function(parent) {

	var my = parent.Ring = parent.Ring || {}

	my.make = function(ringIndex, numRingCells, numBlockStyles, ringTranslationY, ringRotationY) {
		var cells = [];
		for (var i = 0; i < numRingCells; i++) {
			cells[i] = BC.Cell.make(i, numBlockStyles, ringRotationY);
		}

		var translationY = -ringIndex * ringTranslationY;
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