var BC = (function(parent) {

	var module = parent.Cell = parent.Cell || {}
	var my = module.Chain = module.Chain || {}

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

		function intersects(chain1, chain2) {
			for (var i = 0; i < chain1.length; i++) {
				var cell1 = chain1[i];
				for (var j = 0; j < chain2.length; j++) {
					var cell2 = chain2[j];
					if (cell1.blockStyle === cell2.blockStyle
							&& cell1.row === cell2.row
							&& cell1.col === cell2.col) {
						return true;
					}
				}
			}
			return false;
		}

		function contains(chain, otherMatch) {
			for (var i = 0; i < chain.length; i++) {
				var match = chain[i];
				if (match.blockStyle === otherMatch.blockStyle
						&& match.row === otherMatch.row
						&& match.col === otherMatch.col) {
					return true;
				}
			}
			return false;
		}

		function getCombinedChains() {
			var combinedChains = [];

			var horizontalChains = getHorizontalChains();
			var verticalChains = getVerticalChains();

			while (horizontalChains.length > 0) {
				var chain = horizontalChains.shift();
				combinedChains.push(chain);

				while (true) {
					// Check for new vertical intersections.
					var intersected = false;
					for (var i = 0; i < verticalChains.length; i++) {
						if (intersects(chain, verticalChains[i])) {
							for (var j = 0; j < verticalChains[i].length; j++) {
								if (!contains(chain, verticalChains[i][j])) {
									chain.push(verticalChains[i][j]);
								}
							}
							verticalChains.splice(i, 1);
							intersected = true;
						}
					}

					// Start creating the next combined chain if no intersections.
					if (!intersected) {
						break;
					}

					// Check for new horizontal intersections.
					var intersected = false;
					for (var i = 0; i < horizontalChains.length; i++) {
						if (intersects(chain, horizontalChains[i])) {
							for (var j = 0; j < horizontalChains[i].length; j++) {
								if (!contains(chain, horizontalChains[i][j])) {
									chain.push(horizontalChains[i][j]);
								}
							}
							horizontalChains.splice(i, 1);
							intersected = true;
						}
					}

					if (!intersected) {
						break;
					}
				}
			}

			while (verticalChains.length > 0) {
				var chain = verticalChains.shift();
				combinedChains.push(chain);
			}

			for (var i = 0; i < combinedChains.length; i++) {
				combinedChains[i].sort(function(m1, m2) {
					return m1.row - m2.row;
				});
			}

			return combinedChains;
		}

		return getCombinedChains();
	};

	my.makeManager = function() {
		var CellState = BC.Cell.CellState;

		var cellQueue = [];
		var chainQueue = [];

		function update(board) {
			var newChains = BC.Cell.Chain.find(board);
			for (var i = 0; i < newChains.length; i++) {
				var chain = newChains[i];
				chainQueue.push(chain);
				for (var j = 0; j < chain.length; j++) {
					var cell = chain[j].cell;
					cell.markBlock();
					cellQueue.push(cell);
				}
			}

			if (cellQueue.length > 0) {
				var cell = cellQueue[0];
				switch (cell.state) {
					case CellState.MARKED_BLOCK:
					case CellState.FREEZING_BLOCK:
						break;

					case CellState.READY_TO_CLEAR_BLOCK:
						cell.clearBlock();
						break;

					case CellState.CLEARING_BLOCK:
						break;

					default:
						cellQueue.shift();
						break;
				}
			}

			if (chainQueue.length > 0) {
				var chain = chainQueue[0];

				var finished = true;
				for (var i = 0; i < chain.length; i++) {
					var cell = chain[i].cell;
					finished &= cell.state === CellState.EMPTY_RESERVED;
				}

				if (finished) {
					for (var i = 0; i < chain.length; i++) {
						var cell = chain[i].cell;
						cell.state = CellState.EMPTY;
					}
					chainQueue.shift();
				}
			}
		}

		return {
			update: update
		};
	};

	return parent;

}(BC || {}))