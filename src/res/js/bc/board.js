var BC = (function(parent) {

	var my = parent.Board = parent.Board || {}

	my.make = function(metrics, rings) {
		var Direction = BC.Constants.Direction;
		var CellState = BC.Cell.CellState;

		var DROP_DURATION = 0.075;
		var SWAP_DURATION = 0.125;
		var NUM_REQUIRED_MATCHES = 3;

		var board = {
			rings: rings,
			matrix: BC.Matrix.identity,
			metrics: metrics,
			move: move,
			rotate: rotate,
			swap: swap,
			update: update
		};

		var currentRing = 0;
		var currentCell = metrics.numCells - 1;
		var clearBlockQueue = [];
		var rotation = [0, 0, 0];

		var selector = BC.Selector.make(metrics, board);
		board.selector = selector;

		function move(direction) {
			switch (direction) {
				case Direction.LEFT:
					moveSelectorLeft();
					break;

				case Direction.RIGHT:
					moveSelectorRight();
					break;

				case Direction.UP:
					moveSelectorUp();
					break;

				case Direction.DOWN:
					moveSelectorDown();
					break;
			}
		}

		function moveSelectorLeft() {
			if (selector.move(Direction.LEFT)) {;
				currentCell--;
				if (currentCell < 0) {
					currentCell = metrics.numCells - 1;
				}
			}
		}

		function moveSelectorRight() {
			if (selector.move(Direction.RIGHT)) {
				currentCell++;
				if (currentCell >= metrics.numCells) {
					currentCell = 0;
				}
			}
		}

		function moveSelectorUp() {
			if (currentRing > 0 && selector.move(Direction.UP)) {
				currentRing--;
			}
		}

		function moveSelectorDown() {
			if (currentRing + 1 < board.rings.length && selector.move(Direction.DOWN)) {
				currentRing++;
			}
		}

		function rotate(deltaRotation) {
			rotation[1] += deltaRotation;
		}

		function swap() {
			var ring = board.rings[currentRing];
			var leftCell = ring.cells[currentCell];
			var rightCell = ring.cells[(currentCell + 1) % ring.cells.length];

			var leftBlockStyle = leftCell.blockStyle;
			var rightBlockStyle = rightCell.blockStyle;

			BC.Util.log("swap: (" + leftCell.state + ", " + rightCell.state + ")");

			var moveLeft = leftCell.state === CellState.EMPTY && rightCell.state === CellState.BLOCK;
			if (moveLeft) {
				rightCell.sendBlock(SWAP_DURATION, Direction.LEFT);
				leftCell.receiveBlock(SWAP_DURATION, Direction.RIGHT, rightBlockStyle);
				return;
			}

			var moveRight = leftCell.state === CellState.BLOCK && rightCell.state === CellState.EMPTY;
			if (moveRight) {
				leftCell.sendBlock(SWAP_DURATION, Direction.RIGHT);
				rightCell.receiveBlock(SWAP_DURATION, Direction.LEFT, leftBlockStyle);
				return;
			}

			var swap = leftCell.state === CellState.BLOCK && rightCell.state === CellState.BLOCK;
			if (swap) {
				leftCell.receiveBlock(SWAP_DURATION, Direction.RIGHT, rightBlockStyle);
				rightCell.receiveBlock(SWAP_DURATION, Direction.LEFT, leftBlockStyle);
				return;
			}
		}

		function update(watch) {
			// 1st pass - update each cell's existing animations.
			for (var i = 0; i < metrics.numRings; i++) {
				for (var j = 0; j < metrics.numCells; j++) {
					updateCell(watch, i, j);
				}
			}

			// 2nd pass - look for new matches and dropping blocks.
			var newBlockMatches = false;
			for (var i = 0; i < metrics.numRings; i++) {
				for (var j = 0; j < metrics.numCells; j++) {
					newBlockMatches |= updateCell2(i, j);
				}
			}

			// Clear one block at a time.
			updateClearBlockQueue(newBlockMatches);

			// Update selector which might have moved the board.
			selector.update(watch);
			updateBoardMatrix();
		}

		function updateCell(watch, row, col) {
			var cell = getCell(row, col);
			cell.update(watch);
		}

		function updateCell2(row, col) {
			var newBlockMatches = updateBlockMatches(row, col);
			updateBlockDrops(row, col);
			return newBlockMatches;
		}

		function updateBlockMatches(row, col) {
			var matches = getBlockMatches(row, col);
			for (var i = 0; i < matches.length; i++) {
				var cell = matches[i].cell;
				if (cell.state !== CellState.MARKED_BLOCK) {
					cell.markBlock();
					clearBlockQueue.push(matches[i]);
				}
			}
			return matches.length > 0;
		}

		function getBlockMatches(row, col) {
			var centerCell = getCell(row, col);
			if (centerCell.state !== CellState.BLOCK) {
				return [];
			}

			var matches = [];

			var horizontalMatches = getHorizontalMatches(centerCell.blockStyle, row, col);
			if (horizontalMatches.length + 1 >= NUM_REQUIRED_MATCHES) {
				matches = matches.concat(horizontalMatches);
			}

			var verticalMatches = getVerticalMatches(centerCell.blockStyle, row, col);
			if (verticalMatches.length + 1 >= NUM_REQUIRED_MATCHES) {
				matches = matches.concat(verticalMatches);
			}

			if (matches.length > 0) {
				matches.push({
					cell: centerCell,
					row: row,
					col: col
				});
			}

			return matches;
		}

		function getHorizontalMatches(blockStyle, row, col) {
			var matches = [];

			// Go left
			for (var leftCol = getLeftCol(col); leftCol != col; leftCol = getLeftCol(leftCol)) {
				var leftCell = getCell(row, leftCol);
				if (isMatch(blockStyle, leftCell)) {
					matches.push({
						cell: leftCell,
						row: row,
						col: leftCol
					});
				} else {
					break;
				}
			}

			// Go right
			for (var rightCol = getRightCol(col); rightCol != col; rightCol = getRightCol(rightCol)) {
				var rightCell = getCell(row, rightCol);
				if (isMatch(blockStyle, rightCell)) {
					matches.push({
						cell: rightCell,
						row: row,
						col: rightCol
					});
				} else {
					break;
				}
			}

			return matches;
		}

		function getVerticalMatches(blockStyle, row, col) {
			var matches = [];

			// Go up
			for (var upRow = row - 1; upRow >= 0; upRow--) {
				var upCell = getCell(upRow, col);
				if (isMatch(blockStyle, upCell)) {
					matches.push({
						cell: upCell,
						row: upRow,
						col: col
					});
				} else {
					break;
				}
			}

			// Go down
			for (var downRow = row + 1; downRow < metrics.numRings; downRow++) {
				var downCell = getCell(downRow, col);
				if (isMatch(blockStyle, downCell)) {
					matches.push({
						cell: downCell,
						row: downRow,
						col: col
					});
				} else {
					break;
				}
			}

			return matches;
		}

		function isMatch(blockStyle, cell) {
			return (cell.state === CellState.BLOCK || cell.state === CellState.MARKED_BLOCK)
					&& cell.blockStyle === blockStyle;
		}

		function getCell(row, col) {
			return board.rings[row].cells[col];
		}

		function getLeftCol(col) {
			var leftCol = col - 1;
			if (leftCol < 0) {
				return metrics.numCells - 1;
			}
			return leftCol;
		}

		function getRightCol(col) {
			var rightCol = col + 1;
			if (rightCol === metrics.numCells) {
				return 0;
			}
			return rightCol;
		}

		function updateBlockDrops(row, col) {
			var cell = getCell(row, col);
			if (cell.state !== CellState.BLOCK) {
				return;
			}

			var downRow = row + 1;
			if (downRow >= metrics.numRings) {
				return;
			}
			var downCell = getCell(downRow, col);

			if (cell.state === CellState.BLOCK && downCell.state == CellState.EMPTY) {
				var blockStyle = cell.sendBlock(DROP_DURATION);
				downCell.receiveBlock(DROP_DURATION, Direction.UP, blockStyle);
			}
		}

		function updateClearBlockQueue(newBlockMatches) {
			if (clearBlockQueue.length > 0) {
				if (newBlockMatches) {
					clearBlockQueue.sort(function(m1, m2) {
						if (m1.row - m2.row != 0) {
							return m1.row - m2.row;
						}
						if (m1.col - m2.col != 0) {
							return m1.col - m2.col;
						}
						return 0;
					});
				}

				var cell = clearBlockQueue[0].cell;
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
						clearBlockQueue.shift();
						break;
				}
			}
		}

		function updateBoardMatrix() {
			var rotationXMatrix = BC.Matrix.makeXRotation(rotation[0]);
			var rotationYMatrix = BC.Matrix.makeYRotation(rotation[1]);
			var rotationZMatrix = BC.Matrix.makeZRotation(rotation[2]);

			var matrix = BC.Matrix.matrixMultiply(rotationZMatrix, rotationYMatrix);
			matrix = BC.Matrix.matrixMultiply(matrix, rotationXMatrix);
			board.matrix = matrix;
		}

		return board;
	};

	return parent;

}(BC || {}))
