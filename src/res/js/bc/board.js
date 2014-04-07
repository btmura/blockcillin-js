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

		var swapMovementDuration = 0.125;

		var ringRotationY = 2 * Math.PI / specs.numRingCells;
		var ringTranslationY = specs.ringMaxY - specs.ringMinY;

		var selector = {
			matrix: BC.Matrix.identity,
		};

		var selectorState = {
			direction: Direction.NONE,
			translation: [0, 0, 0],
			elapsedMovementTime: 0,
			maxMovementTime: 0.05
		};

		var board = {
			rings: [],
			selector: selector,
			matrix: BC.Matrix.identity,

			numRingCells: specs.numRingCells,
			innerRingRadius: specs.innerRingRadius,
			outerRingRadius: specs.outerRingRadius,
			ringMaxY: specs.ringMaxY,
			ringMinY: specs.ringMinY,

			move: move,
			swap: swap,
			update: update
		};

		var boardState = {
			currentRing: 0,
			currentCell: specs.numRingCells - 1,
			rotation: [0, 0, 0]
		};

		var numRings = 3;
		for (var i = 0; i < numRings; i++) {
			board.rings[i] = makeRing(i);
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
				blockStyle: blockStyle,
				matrix: matrix,
				state: CellState.NONE,
				rotation: rotation,
				currentSwapTime: 0
			};
		}

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
			if (selectorState.direction === Direction.NONE) {
				selectorState.direction = Direction.LEFT;
				selectorState.elapsedMovementTime = 0;
				boardState.currentCell--;
				if (currentCell < 0) {
					currentCell = specs.numRingCells - 1;
				}
			}
		}

		function moveSelectorRight() {
			if (selectorState.direction === Direction.NONE) {
				selectorState.direction = Direction.RIGHT;
				selectorState.elapsedMovementTime = 0;
				boardState.currentCell++;
				if (boardState.currentCell >= specs.numRingCells) {
					boardState.currentCell = 0;
				}
			}
		}

		function moveSelectorUp() {
			if (selectorState.direction === Direction.NONE && boardState.currentRing > 0) {
				selectorState.direction = Direction.UP;
				selectorState.elapsedMovementTime = 0;
				boardState.currentRing--;
			}
		}

		function moveSelectorDown() {
			if (selectorState.direction === Direction.NONE && boardState.currentRing + 1 < board.rings.length) {
				selectorState.direction = Direction.DOWN;
				selectorState.elapsedMovementTime = 0;
				boardState.currentRing++;
			}
		}

		function swap() {
			var ring = board.rings[boardState.currentRing];
			var cell = ring.cells[boardState.currentCell];
			var nextCell = ring.cells[(boardState.currentCell + 1) % ring.cells.length];

			var prevBlockStyle = cell.blockStyle;

			cell.blockStyle = nextCell.blockStyle;
			cell.state = CellState.SWAP_RIGHT;
			cell.rotation[1] += ringRotationY;
			cell.currentSwapTime = 0;

			nextCell.blockStyle = prevBlockStyle;
			nextCell.state = CellState.SWAP_LEFT;
			nextCell.rotation[1] -= ringRotationY;
			nextCell.currentSwapTime = 0;
		}

		function update(deltaTime, now) {
			var rings = board.rings;
			for (var i = 0; i < rings.length; i++) {
				var cells = rings[i].cells;
				for (var j = 0; j < cells.length; j++) {
					var cell = cells[j];
					if (cell.state == CellState.SWAP_LEFT || cell.state == CellState.SWAP_RIGHT) {
						var time = deltaTime;
						if (cell.currentSwapTime + deltaTime > swapMovementDuration) {
							time = swapMovementDuration - cell.currentSwapTime;
						}

						var rotationDelta = ringRotationY * time / swapMovementDuration;
						if (cell.state == CellState.SWAP_LEFT) {
							cell.rotation[1] += rotationDelta;
						} else {
							cell.rotation[1] -= rotationDelta;
						}
						cell.matrix = BC.Matrix.makeYRotation(cell.rotation[1]);

						cell.currentSwapTime += time;
						if (cell.currentSwapTime >= swapMovementDuration) {
							cell.state = CellState.NONE;
							cell.currentSwapTime = 0;
						}
					}
				}
			}

			if (selectorState.direction !== Direction.NONE) {
				if (selectorState.elapsedMovementTime + deltaTime > selectorState.maxMovementTime) {
					deltaTime = selectorState.maxMovementTime - selectorState.elapsedMovementTime;
				}

				var verticalTranslation = deltaTime * ringTranslationY / selectorState.maxMovementTime;
				var horizontalRotation = deltaTime * ringRotationY / selectorState.maxMovementTime;

				switch (selectorState.direction) {
					case Direction.UP:
						selectorState.translation[1] += verticalTranslation;
						break;

					case Direction.DOWN:
						selectorState.translation[1] -= verticalTranslation;
						break;

					case Direction.LEFT:
						boardState.rotation[1] += horizontalRotation;
						break;

					case Direction.RIGHT:
						boardState.rotation[1] -= horizontalRotation;
						break;
				}

				selectorState.elapsedMovementTime += deltaTime;
				if (selectorState.elapsedMovementTime >= selectorState.maxMovementTime) {
					selectorState.direction = Direction.NONE;
					selectorState.elapsedMovementTime = 0;
				}
			}

			updateBoardMatrix();
			updateSelectorMatrix(now);
		}

		function updateBoardMatrix() {
			var rotationXMatrix = BC.Matrix.makeXRotation(boardState.rotation[0]);
			var rotationYMatrix = BC.Matrix.makeYRotation(boardState.rotation[1]);
			var rotationZMatrix = BC.Matrix.makeZRotation(boardState.rotation[2]);

			var matrix = BC.Matrix.matrixMultiply(rotationZMatrix, rotationYMatrix);
			matrix = BC.Matrix.matrixMultiply(matrix, rotationXMatrix);
			board.matrix = matrix;
		}

		function updateSelectorMatrix(now) {
			var scale = 1 + Math.abs(Math.sin(4 * now)) / 25;
			var scaleMatrix = BC.Matrix.makeScale(scale, scale, 1);
			var translationMatrix = BC.Matrix.makeTranslation(
					selectorState.translation[0],
					selectorState.translation[1],
					selectorState.translation[2]);
			board.selector.matrix = BC.Matrix.matrixMultiply(scaleMatrix, translationMatrix);
		}

		return board;
	};

	return parent;

}(BC || {}))
