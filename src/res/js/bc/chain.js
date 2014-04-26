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

		// Find horizontal chains of 3+ rows.
		for (var row = 0; row < numRows; row++) {
			for (var startCol = 0; startCol < numCols; ) {
				var cell = getCell(row, startCol);
				if (cell.state !== CellState.BLOCK) {
					startCol++;
					continue;
				}

				for (var endCol = startCol + 1; endCol < numCols; endCol++) {
					var nextCell = getCell(row, endCol);
					if (nextCell.state !== cell.state || nextCell.blockStyle !== cell.blockStyle) {
						break;
					}
				}

				var matching = endCol - startCol;
				if (matching >= 3) {
					var newChain = [];
					for (var matchCol = startCol; matchCol < endCol; matchCol++) {
						var matchCell = getCell(row, matchCol);
						newChain.push({
							cell: matchCell,
							row: row,
							col: matchCol
						});
					}
					chains.push(newChain);
				}

				startCol = endCol;
			}
		}

		// Find vertical chains of 3+ cells
		for (var col = 0; col < numCols; col++) {
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