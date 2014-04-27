var BC = (function(parent) {

	var my = parent.Chain = parent.Chain || {}

	my.find = function(board) {
		var CellState = BC.Cell.CellState;

		var NUM_COLS = board.rings[0].cells.length;
		var NUM_ROWS = board.rings.length;
		var NUM_REQUIRED_MATCHES = 3;

		var chains = [];

		function getCell(row, col) {
			return board.rings[row].cells[col];
		}

		function getLeftCol(col) {
			var leftCol = col - 1;
			if (leftCol < 0) {
				return NUM_COLS - 1;
			}
			return leftCol;
		}

		function getRightCol(col) {
			var rightCol = col + 1;
			if (rightCol === NUM_COLS) {
				return 0;
			}
			return rightCol;
		}

		function isMatch(cell, otherCell) {
			return cell.state === otherCell.state && cell.blockStyle == otherCell.blockStyle;
		}

		function getStartCol(row) {
			var startCol = 0;
			var cell = getCell(row, startCol);
			for (var i = 0; i < NUM_COLS; i++) {
				var nextCell = getCell(row, startCol);
				if (!isMatch(cell, nextCell)) {
					break;
				}
				startCol = getRightCol(startCol);
			}
			return startCol;
		}

		function getHorizontalChains() {
			var chains = [];

			for (var row = 0; row < NUM_ROWS; row++) {
				var startOffset = getStartCol(row);

				for (var startCol = 0; startCol < NUM_COLS; ) {
					var realCol = (startCol + startOffset) % NUM_COLS;
					var cell = getCell(row, realCol);
					if (cell.state !== CellState.BLOCK) {
						startCol++;
						continue;
					}

					var matching = 1;
					for (var endCol = startCol + 1; endCol < NUM_COLS; endCol++) {
						var realCol = (endCol + startOffset) % NUM_COLS;
						var nextCell = getCell(row, realCol);
						if (isMatch(cell, nextCell)) {
							matching++;
						} else {
							break;
						}
					}

					if (matching >= NUM_REQUIRED_MATCHES) {
						var newChain = [];
						for (var matchCol = startCol; matchCol < endCol; matchCol++) {
							var realCol = (matchCol + startOffset) % NUM_COLS;
							var matchCell = getCell(row, realCol);
							newChain.push({
								cell: matchCell,
								row: row,
								col: realCol
							});
						}
						chains.push(newChain);
					}

					startCol = endCol;
				}
			}

			return chains;
		}

		function getVerticalChains() {
			var chains = [];

			for (var col = 0; col < NUM_COLS; col++) {
				for (var startRow = 0; startRow < NUM_ROWS; ) {
					var cell = getCell(startRow, col);
					if (cell.state !== CellState.BLOCK) {
						startRow++;
						continue;
					}

					var matching = 1;
					for (var endRow = startRow + 1; endRow < NUM_ROWS; endRow++) {
						var nextCell = getCell(endRow, col);
						if (isMatch(cell, nextCell)) {
							matching++;
						} else {
							break;
						}
					}

					if (matching >= NUM_REQUIRED_MATCHES) {
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
		}

		function getCombinedChains() {
			var horizontalChains = getHorizontalChains();
			var verticalChains = getVerticalChains();
			return horizontalChains.concat(verticalChains);
		}

		return getCombinedChains();
	};

	return parent;

}(BC || {}))