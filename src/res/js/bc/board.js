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

		var rings = [];
		var numRings = 3;
		for (var i = 0; i < numRings; i++) {
			rings[i] = makeRing(i);
		}

		function makeRing(ringIndex) {
			var cells = [];
			for (var i = 0; i < specs.numRingCells; i++) {
				cells[i] = makeCell(i);
			}

			var translationY = -ringIndex * ringTranslationY;
			var matrix = BC.Matrix.makeTranslation(0, translationY, 0);

			return {
				cells: cells,
				matrix: matrix
			};
		}

		function makeCell(cellIndex) {
			return BC.Cell.make(cellIndex, specs.numBlockStyles, ringRotationY);
		}

		var selector = BC.Selector.make();

		var board = {
			rings: rings,
			selector: selector,
			matrix: BC.Matrix.identity,

			numRingCells: specs.numRingCells,
			innerRingRadius: specs.innerRingRadius,
			outerRingRadius: specs.outerRingRadius,
			ringMaxY: specs.ringMaxY,
			ringMinY: specs.ringMinY,

			move: move,
			swap: swap,
			update: update,

			// private details
			currentRing: 0,
			currentCell: specs.numRingCells - 1,
			rotation: [0, 0, 0]
		};

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
				board.currentCell--;
				if (board.currentCell < 0) {
					board.currentCell = specs.numRingCells - 1;
				}
			}
		}

		function moveSelectorRight() {
			if (selector.move(Direction.RIGHT)) {
				board.currentCell++;
				if (board.currentCell >= specs.numRingCells) {
					board.currentCell = 0;
				}
			}
		}

		function moveSelectorUp() {
			if (board.currentRing > 0 && selector.move(Direction.UP)) {
				board.currentRing--;
			}
		}

		function moveSelectorDown() {
			if (board.currentRing + 1 < board.rings.length && selector.move(Direction.DOWN)) {
				board.currentRing++;
			}
		}

		function swap() {
			var ring = board.rings[board.currentRing];
			var cell = ring.cells[board.currentCell];
			var nextCell = ring.cells[(board.currentCell + 1) % ring.cells.length];
			cell.swap(nextCell);
		}

		function update(deltaTime, now) {
			var rings = board.rings;
			for (var i = 0; i < rings.length; i++) {
				var cells = rings[i].cells;
				for (var j = 0; j < cells.length; j++) {
					cells[j].update(deltaTime);
				}
			}

			updateBoardMatrix();

			selector.update(deltaTime, now, ringTranslationY, ringRotationY, board.rotation);
		}

		function updateBoardMatrix() {
			var rotationXMatrix = BC.Matrix.makeXRotation(board.rotation[0]);
			var rotationYMatrix = BC.Matrix.makeYRotation(board.rotation[1]);
			var rotationZMatrix = BC.Matrix.makeZRotation(board.rotation[2]);

			var matrix = BC.Matrix.matrixMultiply(rotationZMatrix, rotationYMatrix);
			matrix = BC.Matrix.matrixMultiply(matrix, rotationXMatrix);
			board.matrix = matrix;
		}

		return board;
	};

	return parent;

}(BC || {}))
