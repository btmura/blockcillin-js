var BC = (function(parent) {

	var my = parent.Board = parent.Board || {}

	my.make = function(metrics, rings) {
		var Direction = BC.Constants.Direction;
		var CellState = BC.Cell.CellState;

		var DROP_DURATION = 0.1;
		var SWAP_DURATION = 0.1;
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

			// 2nd pass - look for new matches.
			var newChains = BC.Chain.find(board);
			for (var i = 0; i < newChains.length; i++) {
				var chain = newChains[i];
				for (var j = 0; j < chain.length; j++) {
					var cell = chain[j].cell;
					if (cell.state !== CellState.MARKED_BLOCK) {
						cell.markBlock();
						clearBlockQueue.push(cell);
					}
				}
			}

			// 3rd pass - look for dropping blocks.
			var newBlockMatches = false;
			for (var i = 0; i < metrics.numRings; i++) {
				for (var j = 0; j < metrics.numCells; j++) {
					updateBlockDrops(i, j);
				}
			}

			// Clear one block at a time.
			updateClearBlockQueue();

			// Update selector which might have moved the board.
			selector.update(watch);
			updateBoardMatrix();
		}

		function updateCell(watch, row, col) {
			var cell = getCell(row, col);
			cell.update(watch);
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

		function getCell(row, col) {
			return board.rings[row].cells[col];
		}

		function updateClearBlockQueue() {
			if (clearBlockQueue.length > 0) {
				var cell = clearBlockQueue[0];
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
