var BC = (function(parent) {

	var my = parent.Board = parent.Board || {}

	/**
	 * Makes a board which tracks the state of all the blocks.
	 *
	 * @param specs.numRingCells - number of cells in each ring
	 * @param specs.numBlockStyles - number of block styles
	 * @returns {Object} board that tracks the state of all the blocks
	 */
	my.make = function(specs) {
		var Direction = BC.Constants.Direction;

		var ringRotationY = 2 * Math.PI / specs.numRingCells;
		var ringTranslationY = specs.ringMaxY - specs.ringMinY;

		var metrics = {
			numRings: 3,
			numCells: specs.numRingCells,
			numBlockTypes: specs.numBlockStyles,
			ringRotationY: ringRotationY,
			ringTranslationY: ringTranslationY
		};

		var rings = [];
		for (var i = 0; i < metrics.numRings; i++) {
			rings[i] = BC.Ring.make(i, metrics);
		}

		var board = {
			rings: rings,
			matrix: BC.Matrix.identity,

			numRingCells: specs.numRingCells,
			innerRingRadius: specs.innerRingRadius,
			outerRingRadius: specs.outerRingRadius,
			ringMaxY: specs.ringMaxY,
			ringMinY: specs.ringMinY,

			move: move,
			rotate: rotate,
			swap: swap,
			update: update,
		};

		var currentRing = 0;
		var currentCell = specs.numRingCells - 1;
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
					currentCell = specs.numRingCells - 1;
				}
			}
		}

		function moveSelectorRight() {
			if (selector.move(Direction.RIGHT)) {
				currentCell++;
				if (currentCell >= specs.numRingCells) {
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
			var cell = ring.cells[currentCell];
			var nextCell = ring.cells[(currentCell + 1) % ring.cells.length];
			cell.swap(nextCell);
		}

		function update(deltaTime, now) {
			var rings = board.rings;
			for (var i = 0; i < rings.length; i++) {
				rings[i].update(deltaTime);
			}

			updateBoardMatrix();

			selector.update(deltaTime, now);
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
