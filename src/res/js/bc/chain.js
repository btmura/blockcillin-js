var BC = (function(parent) {

	var my = parent.Chain = parent.Chain || {}

	my.find = function(board) {
		var CellState = BC.Cell.CellState;

		var chains = [];

		function getCell(row, col) {
			return board.rings[row].cells[col];
		}

		var numCols = board.rings[0].cells.length;
		var numRows = board.rings.length;

		// Find vertical chains of 3+ cells
		for (var col = 0; col < numCols; col++) {
			console.log(col);
			for (var startRow = 0; startRow < numRows; ) {
				var cell = getCell(startRow, col);
				if (cell.state !== CellState.BLOCK) {
					startRow++;
					continue;
				}

				for (var endRow = startRow + 1; endRow < numRows; endRow++) {
					var nextCell = getCell(endRow, col);
					if (nextCell.state !== cell.state || nextCell.blockStyle !== cell.blockStyle) {
						break;
					}
				}

				var matching = endRow - startRow;
				if (matching >= 3) {
					var newChain = [];
					for (var matchRow = startRow; matchRow < endRow; matchRow++) {
						var matchCell = getCell(matchRow, col);
						newChain.push({
							cell: matchCell,
							row: matchRow,
							col: col
						});
					}
					chains.push(newChain);
				}

				startRow = endRow;
			}
		}

		return chains;
	};

	return parent;

}(BC || {}))