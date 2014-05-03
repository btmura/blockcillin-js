var BC = (function(parent) {

	var my = parent.Board = parent.Board || {}

	my.make = function(metrics, rings) {
		var CellState = BC.Cell.CellState;
		var Direction = BC.Constants.Direction;

		var SWAP_DURATION = 0.1;
		var RISING_SPEED = 0.02;

		var board = {
			metrics: metrics,
			rings: rings,

			// Split rotation and translation to render the selector in a fixed position.
			rotationMatrix: BC.Matrix.identity,
			translationMatrix: BC.Matrix.identity,

			move: move,
			rotate: rotate,
			swap: swap,
			update: update
		};

		var currentRing = 0;
		var currentCell = metrics.numCells - 1;

		var rotation = [0, 0, 0];
		var translation = [0, 0, 0];

		var selector = BC.Selector.make(metrics, board);
		board.selector = selector;

		var chainManager = BC.Cell.Chain.makeManager();
		var dropManager = BC.Cell.Drop.makeManager(metrics);

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
			var leftCell = getCell(currentRing, currentCell);
			var rightCell = getCell(currentRing, currentCell + 1);
			BC.Util.log("swap: (" + leftCell.state + ", " + rightCell.state + ")");

			var leftBlockStyle = leftCell.blockStyle;
			var rightBlockStyle = rightCell.blockStyle;

			function isEmpty(cell) {
				return cell.state === CellState.EMPTY || cell.state === CellState.EMPTY_NO_DROP;
			}

			function isBlock(cell) {
				return cell.state === CellState.BLOCK;
			}

			var moveLeft = isEmpty(leftCell) && isBlock(rightCell);
			if (moveLeft) {
				rightCell.sendBlock(SWAP_DURATION, Direction.LEFT);
				leftCell.receiveBlock(SWAP_DURATION, Direction.RIGHT, rightBlockStyle);
				return;
			}

			var moveRight = isBlock(leftCell) && isEmpty(rightCell);
			if (moveRight) {
				leftCell.sendBlock(SWAP_DURATION, Direction.RIGHT);
				rightCell.receiveBlock(SWAP_DURATION, Direction.LEFT, leftBlockStyle);
				return;
			}

			var swap = isBlock(leftCell) && isBlock(rightCell);
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
					var cell = getCell(i, j);
					cell.update(watch);
				}
			}

			// 2nd pass - find new chains and update the board
			chainManager.update(board);

			// 3rd pass - find new dropping blocks and update the board
			dropManager.update(board);

			// Update selector which might have roated the board.
			selector.update(watch);

			updateBoardRotation();
			updateBoardTranslation(watch);
		}

		function updateBoardRotation() {
			var rotationXMatrix = BC.Matrix.makeXRotation(rotation[0]);
			var rotationYMatrix = BC.Matrix.makeYRotation(rotation[1]);
			var rotationZMatrix = BC.Matrix.makeZRotation(rotation[2]);

			var matrix = BC.Matrix.matrixMultiply(rotationZMatrix, rotationYMatrix);
			matrix = BC.Matrix.matrixMultiply(matrix, rotationXMatrix);
			board.rotationMatrix = matrix;
		}

		function updateBoardTranslation(watch) {
			translation[1] += RISING_SPEED * watch.deltaTime;
			board.translationMatrix = BC.Matrix.makeTranslation(
					translation[0],
					translation[1],
					translation[2]);
		}

		function getCell(row, col) {
			return board.rings[row].cells[col % metrics.numCells];
		}

		return board;
	};

	return parent;

}(BC || {}))
