/*
 * Copyright (C) 2014  Brian Muramatsu
 *
 * This file is part of blockcillin.
 *
 * blockcillin is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * blockcillin is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with blockcillin.  If not, see <http://www.gnu.org/licenses/>.
 */

var BC = (function(root) {

	var me = root.Chain = root.Chain || {};

	me.find = function(board) {
		var CellState = BC.Cell.CellState;

		var NUM_COLS = board.rings[0].cells.length;
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
			var NUM_ROWS = board.rings.length;

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
			var NUM_ROWS = board.rings.length;

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

	me.makeManager = function() {
		var CellState = BC.Cell.CellState;

		var cellQueue = [];
		var chainQueue = [];

		function update(board) {
			var newChains = BC.Chain.find(board);
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
					case CellState.BLOCK_CLEARING_MARKED:
					case CellState.BLOCK_CLEARING_PREPARING:
						break;

					case CellState.BLOCK_CLEARING_READY:
						cell.clearBlock();
						break;

					case CellState.BLOCK_CLEARING_IN_PROGRESS:
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
					finished &= !cell.isClearing();
				}

				if (finished) {
					for (var i = 0; i < chain.length; i++) {
						var cell = chain[i].cell;
						if (cell.state === CellState.EMPTY_NO_DROP) {
							cell.state = CellState.EMPTY;
						}
					}
					chainQueue.shift();
				}
			}

			return {
				newChains: newChains,
				pendingChainCount: chainQueue.length
			}
		}

		return {
			update: update
		};
	};

	return root;

}(BC || {}))