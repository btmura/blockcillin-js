var BC = (function(parent) {

	var my = parent.Board = parent.Board || {}

	my.make = function(metrics) {
		var CellState = BC.Cell.CellState;
		var Direction = BC.Constants.Direction;

		var RING_CAPACITY = 11;
		var MAX_RISE_HEIGHT = RING_CAPACITY * metrics.ringHeight;
		var RISE_SPEED = 0.02;
		var SWAP_DURATION = 0.1;
		var NUM_SPARE_RINGS = 2;
		var SPARE_RING_HEIGHT = NUM_SPARE_RINGS * metrics.ringHeight;

		// Keep track of the selector to know what cells to swap.
		var currentRing = 0;
		var currentCell = metrics.numCells - 1;

		// How much to go down before hitting the stage where new rings appear.
		var stageTranslationY = RING_CAPACITY / 2 * -metrics.ringHeight - metrics.ringHeight / 2;

		// How much the topmost ring has risen. Can't exceed the MAX_RISE_HEIGHT or game is over.
		var riseHeight = metrics.ringHeight * metrics.numRings;

		// Set the initial board translation to show the starting rings.
		var translationY = stageTranslationY + riseHeight;

		// Translation of the board. Y is increased over time.
		var translation = [0, translationY, 0];

		// Rotation of the board. Rotated on te z-axi- by the selector.
		var rotation = [0, 0, 0];

		// Rings of cells on the board that are added and removed throughout the game.
		var rings = [];

		// Increasing counter used to translate each new ring relative to the board.
		var ringIndex = 0;

		// Adds a new ring and increments the ring index counter.
		function addRing(selectable) {
			var translationY = -metrics.ringHeight * ringIndex;
			var newRing = BC.Ring.make({
				metrics: metrics,
				translationY: translationY,
				selectable: selectable
			});
			rings.push(newRing);

			ringIndex++;
		}

		// Removes the topmost ring. We don't decrement the index counter.
		function removeRing() {
			rings.shift();
			riseHeight -= metrics.ringHeight;
			currentRing--;
		}

		// Add the initial rings.
		for (var i = 0; i < metrics.numRings; i++) {
			addRing(true);
		}

		// Add the spare rings.
		for (var i = 0; i < NUM_SPARE_RINGS; i++) {
			addRing(false);
		}

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

		updateBoardMatrices();

		var selector = BC.Selector.make(metrics, board);
		board.selector = selector;

		var stage = BC.Stage.make(metrics, stageTranslationY);
		board.stage = stage;

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
			if (currentRing + 1 < board.rings.length
					&& rings[currentRing + 1].isSelectable()
					&& selector.move(Direction.DOWN)) {
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

			// Whether to raise the board.
			var stopRising = false;

			// 2nd pass - find new dropping blocks and update the board
			stopRising |= dropManager.update(board);

			// 3rd pass - find new chains and update the board
			stopRising |= chainManager.update(board);

			if (!stopRising) {
				raiseBoard(watch);
			}

			// Update selector which might have rotated the board.
			selector.update(watch);

			// Update the board matrices.
			updateBoardMatrices();

			// Update
			updateBoardRings();

			return isGameOver();
		}

		function raiseBoard(watch, rise) {
			var translationDelta = RISE_SPEED * watch.deltaTime;
			if (riseHeight + translationDelta > MAX_RISE_HEIGHT) {
				translationDelta = MAX_RISE_HEIGHT - riseHeight;
			}

			riseHeight += translationDelta;
			translation[1] += translationDelta;
		}

		function updateBoardMatrices() {
			updateBoardTranslation();
			updateBoardRotation();
		}

		function updateBoardTranslation() {
			// TODO(btmura): consolidate to BC.Matrix.makeTranslation(array)
			board.translationMatrix = BC.Matrix.makeTranslation(
					translation[0],
					translation[1],
					translation[2]);
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

		function updateBoardRings() {
			// Remove any rings at the top that are now empty.
			while (rings.length > 0 && rings[0].isEmpty()) {
				removeRing();
			}

			// Add rings till we hit hit the ground and then add some spare rings.
			var totalRingHeight = metrics.ringHeight * rings.length;
			var gap = riseHeight - totalRingHeight;
			while (gap > -SPARE_RING_HEIGHT) {
				addRing(false); // We will update the selectability later.
				gap -= metrics.ringHeight;
			}

			// Update ring selectability.
			for (var i = rings.length - 1; i >= 0; i--) {
				// Quit since everything above should already be selectable.
				if (rings[i].isSelectable()) {
					break;
				}

				// Make rings selectable if they are above the ground (== 0).
				var bottom = riseHeight - metrics.ringHeight * (i + 1);
				if (bottom >= 0) {
					rings[i].setSelectable(true);
				}
			}
		}

		function isGameOver() {
			return riseHeight >= MAX_RISE_HEIGHT;
		}

		function getCell(row, col) {
			return rings[row].cells[col % metrics.numCells];
		}

		return board;
	};

	return parent;

}(BC || {}))
