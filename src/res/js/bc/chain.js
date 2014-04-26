var BC = (function(parent) {

	var my = parent.Chain = parent.Chain || {}

	my.find = function(board) {
		var chains = [];

		function getCell(row, col) {
			return board.rings[row].cells[col];
		}

		var numRows = 4;
		var col = 0;

		// Find vertical chains of 3+ cells
		for (var startRow = 0; startRow < numRows; ) {
			var cell = getCell(startRow, col);
			var blockStyle = cell.blockStyle;

			for (var endRow = startRow + 1; endRow < numRows; endRow++) {
				var cell2 = getCell(endRow, col);
				var blockStyle2 = cell2.blockStyle;
				if (blockStyle !== blockStyle2) {
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

		return chains;
	};

	return parent;

}(BC || {}))