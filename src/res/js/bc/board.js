var BC = (function(parent) {

	var my = parent.Board = parent.Board || {}

	my.make = function(metrics) {
		var Direction = BC.Constants.Direction;
		var CellState = BC.Cell.CellState;

		var DROP_DURATION = 0.075;
		var SWAP_DURATION = 0.125;

		var rings = [];
		for (var i = 0; i < metrics.numRings; i++) {
			rings[i] = BC.Ring.make(i, metrics);
		}

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
		var rotation = [0, 0, 0];

		var clearCellQueue = [];

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

			console.log(leftCell.state + ", " + rightCell.state);

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
			for (var i = 0; i < metrics.numRings; i++) {
				for (var j = 0; j < metrics.numCells; j++) {
					updateCell(i, j);
				}
			}

			for (var i = 0; i < metrics.numRings; i++) {
				for (var j = 0; j < metrics.numCells; j++) {
					var cell = getCell(i, j);
					cell.update(watch);
				}
			}

			updateClearCellQueue();

			selector.update(watch);
			updateBoardMatrix();
		}

		function updateCell(row, col) {
			checkHorizontal(row, col);
			checkVertical(row, col);
			checkMoveDown(row, col);
		}

		function checkHorizontal(row, col) {
			var cell = getCell(row, col);
			if (cell.state !== CellState.BLOCK) {
				return false;
			}

			// Check left cell
			var leftCol = col - 1;
			if (leftCol < 0) {
				leftCol = metrics.numCells - 1;
			}

			var leftCell = getCell(row, leftCol);
			if (leftCell.state !== CellState.BLOCK || leftCell.blockStyle !== cell.blockStyle) {
				return false;
			}

			// Check right cell
			var rightCol = col + 1;
			if (rightCol >= metrics.numCells) {
				rightCol = 0;
			}

			var rightCell = getCell(row, rightCol);
			if (rightCell.state !== CellState.BLOCK || rightCell.blockStyle !== cell.blockStyle) {
				return false;
			}

			leftCell.markBlock();
			cell.markBlock();
			rightCell.markBlock();
			clearCellQueue.push(leftCell, cell, rightCell);
			return true;
		}

		function checkVertical(row, col) {
			var cell = getCell(row, col);
			if (cell.state !== CellState.BLOCK) {
				return false;
			}

			// Check cell above
			var upRow = row - 1;
			if (upRow < 0) {
				return false;
			}

			var upCell = getCell(upRow, col);
			if (upCell.state !== CellState.BLOCK || upCell.blockStyle !== cell.blockStyle) {
				return false;
			}

			// Check cell below
			var downRow = row + 1;
			if (downRow >= metrics.numRings) {
				return false;
			}

			var downCell = getCell(downRow, col);
			if (downCell.state !== CellState.BLOCK || downCell.blockStyle !== cell.blockStyle) {
				return false;
			}

			upCell.markBlock();
			cell.markBlock();
			downCell.markBlock();
			clearCellQueue.push(upCell, cell, downCell);
			return true;
		}

		function checkMoveDown(row, col) {
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

		function updateClearCellQueue() {
			if (clearCellQueue.length > 0) {
				console.log("CC LENGTH " + clearCellQueue.length);
				var cell = clearCellQueue[0];
				switch (cell.state) {
					case CellState.PREPARING_TO_CLEAR_BLOCK:
						break;

					case CellState.READY_TO_CLEAR_BLOCK:
						console.log("STARTING");
						cell.clearBlock();
						break;

					case CellState.CLEARING_BLOCK:
						break;

					case CellState.EMPTY:
						clearCellQueue.shift();
						break;

					default:
						console.log("STATE " + cell.state);
						// clearCellQueue.shift();
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
