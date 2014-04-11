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

		var CellState = {
			NONE: 0,
			SWAP_LEFT: 1,
			SWAP_RIGHT: 2
		};

		var maxCellSwapTime = 0.125;

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
			var blockStyle = BC.Math.randomInt(specs.numBlockStyles);

			var rotation = [0, cellIndex * ringRotationY, 0];
			var matrix = BC.Matrix.makeYRotation(rotation[1]);

			return {
				matrix: matrix,
				state: CellState.NONE,
				blockStyle: blockStyle,

				// private details
				elapsedSwapTime: 0,
				rotation: rotation
			};
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

			var prevBlockStyle = cell.blockStyle;

			cell.blockStyle = nextCell.blockStyle;
			cell.state = CellState.SWAP_RIGHT;
			cell.rotation[1] += ringRotationY;
			cell.elapsedSwapTime = 0;

			nextCell.blockStyle = prevBlockStyle;
			nextCell.state = CellState.SWAP_LEFT;
			nextCell.rotation[1] -= ringRotationY;
			nextCell.elapsedSwapTime = 0;
		}

		function update(deltaTime, now) {
			var rings = board.rings;
			for (var i = 0; i < rings.length; i++) {
				var cells = rings[i].cells;
				for (var j = 0; j < cells.length; j++) {
					var cell = cells[j];
					if (cell.state == CellState.SWAP_LEFT || cell.state == CellState.SWAP_RIGHT) {
						var time = deltaTime;
						if (cell.elapsedSwapTime + deltaTime > maxCellSwapTime) {
							time = maxCellSwapTime - cell.elapsedSwapTime;
						}

						var rotationDelta = ringRotationY * time / maxCellSwapTime;
						if (cell.state == CellState.SWAP_LEFT) {
							cell.rotation[1] += rotationDelta;
						} else {
							cell.rotation[1] -= rotationDelta;
						}
						cell.matrix = BC.Matrix.makeYRotation(cell.rotation[1]);

						cell.elapsedSwapTime += time;
						if (cell.elapsedSwapTime >= maxCellSwapTime) {
							cell.state = CellState.NONE;
							cell.elapsedSwapTime = 0;
						}
					}
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
