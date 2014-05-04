var BC = (function(parent) {

	var my = parent.Board = parent.Board || {}

	my.make = function(metrics) {
		var CellState = BC.Cell.CellState;
		var Direction = BC.Constants.Direction;

		var RING_CAPACITY = 11;
		var MAX_RISE_HEIGHT = RING_CAPACITY * metrics.ringHeight;
		var RISE_SPEED = 0.02;
		var SWAP_DURATION = 0.1;

		// Rings of cells on the board that are added and removed throughout the game.
		var rings = [];

		// Increasing counter used to translate each new ring relative to the board.
		var ringIndex = 0;

		// Adds a new ring and increments the ring index counter.
		function addRing() {
			var translationY = -metrics.ringHeight * ringIndex;
			var newRing = BC.Ring.make(metrics, translationY);
			rings.push(newRing);
			ringIndex++;
		}

		// Add the initial rings.
		for (var i = 0; i < metrics.numRings; i++) {
			addRing();
		}

		// How much to go down before hitting the stage where new rings appear.
		var stageTranslationY = RING_CAPACITY / 2 * -metrics.ringHeight - metrics.ringHeight / 2;

		// How much to initially rise to show the starting rings.
		var riseTranslationY = metrics.ringHeight * metrics.numRings;

		// Set the initial board translation to show the starting rings.
		var translationY = stageTranslationY + riseTranslationY;

		// Translation of the board. Y is increased over time.
		var translation = [0, translationY, 0];

		// Rotation of the board. Rotated on te z-axi- by the selector.
		var rotation = [0, 0, 0];

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

		var selector = BC.Selector.make(metrics, board);
		board.selector = selector;

		var stage = BC.Stage.make(metrics, stageTranslationY);
		board.stage = stage;

		var chainManager = BC.Cell.Chain.makeManager();
		var dropManager = BC.Cell.Drop.makeManager(metrics);

		var currentRing = 0;
		var currentCell = metrics.numCells - 1;

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
			for (var i = 0; i < rings.length; i++) {
				for (var j = 0; j < metrics.numCells; j++) {
					var cell = getCell(i, j);
					cell.update(watch);
				}
			}

			// 2nd pass - find new chains and update the board
			chainManager.update(board);

			// 3rd pass - find new dropping blocks and update the board
			dropManager.update(board);

			// Update selector which might have rotated the board.
			selector.update(watch);

			// Update the board's matrices once the dust has cleared.
			updateBoardRotation();
			updateBoardTranslation(watch);

			clearEmptyRings();
			addNecessaryRings();
		}

		function updateBoardRotation() {
			// TODO(btmura): consolidate to BC.Matrix.makeRotation(...)
			var rotationXMatrix = BC.Matrix.makeXRotation(rotation[0]);
			var rotationYMatrix = BC.Matrix.makeYRotation(rotation[1]);
			var rotationZMatrix = BC.Matrix.makeZRotation(rotation[2]);

			var matrix = BC.Matrix.matrixMultiply(rotationZMatrix, rotationYMatrix);
			matrix = BC.Matrix.matrixMultiply(matrix, rotationXMatrix);
			board.rotationMatrix = matrix;
		}

		function updateBoardTranslation(watch) {
			var translationDelta = RISE_SPEED * watch.deltaTime;
			if (riseTranslationY + translationDelta > MAX_RISE_HEIGHT) {
				translationDelta = MAX_RISE_HEIGHT - riseTranslationY;
			}

			riseTranslationY += translationDelta;
			translation[1] += translationDelta;

			// TODO(btmura): consolidate to BC.Matrix.makeTranslation(array)
			board.translationMatrix = BC.Matrix.makeTranslation(
					translation[0],
					translation[1],
					translation[2]);
		}

		function clearEmptyRings() {
			while (rings.length > 0 && rings[0].isEmpty()) {
				rings.shift();
				currentRing--;
			}
		}

		function addNecessaryRings() {
			var totalRingHeight = metrics.ringHeight * rings.length;
			var gap = riseTranslationY - totalRingHeight;
			var newRingCount = Math.ceil(gap / metrics.ringHeight);
			for (var i = 0; i < newRingCount; i++) {
				addRing();
			}
		}

		function getCell(row, col) {
			return rings[row].cells[col % metrics.numCells];
		}

		return board;
	};

	return parent;

}(BC || {}))
