var BC = (function(parent) {

	var my = parent.Board = parent.Board || {}

	/**
	 * Makes a board which tracks the state of all the blocks.
	 *
	 * @param specs.numRingCells - number of cells in each ring
	 * @param specs.numBlockStyles - number of block styles
	 * @returns {Object} board that tracks the state of all the blocks
	 */
	my.makeModel = function(specs) {
		var Direction = BC.Common.Direction;

		var CellState = {
			NONE: 0,
			SWAP_LEFT: 1,
			SWAP_RIGHT: 2
		};

		var rings = [];

		var currentRing = 0;
		var currentCell = specs.numRingCells - 1;

		var selectorDirection = Direction.NONE;
		var currentSelectorMovementPeriod = 0;
		var maxSelectorMovementPeriod = 0.05;

		var swapMovementDuration = 0.125;

		var selectorTranslation = [0, 0, 0];
		var rotation = [0, 0, 0];

		var ringRotation = 2 * Math.PI / specs.numRingCells;
		var ringTranslation = specs.ringMaxY - specs.ringMinY;
		var scaleMatrix = BC.Matrix.makeScale(1, 1, 1);

		var model = {
			rings: rings,
			boardMatrix: scaleMatrix,
			selectorMatrix: scaleMatrix,

			numRingCells: specs.numRingCells,
			innerRingRadius: specs.innerRingRadius,
			outerRingRadius: specs.outerRingRadius,
			ringMaxY: specs.ringMaxY,
			ringMinY: specs.ringMinY,
			selectorTranslation: selectorTranslation,
			rotation: rotation,

			move: move,
			swap: swap,
			update: update
		};

		var numRings = 3;
		for (var i = 0; i < numRings; i++) {
			rings[i] = makeRing(i);
		}

		function makeRing(ringIndex) {
			var cells = [];
			for (var i = 0; i < specs.numRingCells; i++) {
				cells[i] = makeCell(i);
			}

			var translationY = -ringIndex * ringTranslation;
			var matrix = BC.Matrix.makeTranslation(0, translationY, 0);

			return {
				cells: cells,
				matrix: matrix
			};
		}

		function makeCell(cellIndex) {
			var blockStyle = BC.Math.randomInt(specs.numBlockStyles);

			var rotation = [0, cellIndex * ringRotation, 0];
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
			if (selectorDirection === Direction.NONE) {
				selectorDirection = Direction.LEFT;
				currentSelectorMovementPeriod = 0;
				currentCell--;
				if (currentCell < 0) {
					currentCell = specs.numRingCells - 1;
				}
			}
		}

		function moveSelectorRight() {
			if (selectorDirection === Direction.NONE) {
				selectorDirection = Direction.RIGHT;
				currentSelectorMovementPeriod = 0;
				currentCell++;
				if (currentCell >= specs.numRingCells) {
					currentCell = 0;
				}
			}
		}

		function moveSelectorUp() {
			if (selectorDirection === Direction.NONE && currentRing > 0) {
				selectorDirection = Direction.UP;
				currentSelectorMovementPeriod = 0;
				currentRing--;
			}
		}

		function moveSelectorDown() {
			if (selectorDirection === Direction.NONE && currentRing + 1 < rings.length) {
				selectorDirection = Direction.DOWN;
				currentSelectorMovementPeriod = 0;
				currentRing++;
			}
		}

		function swap() {
			console.log("ring: " + currentRing + " cell: " + currentCell);

			var ring = rings[currentRing];
			var cell = ring.cells[currentCell];
			var nextCell = ring.cells[(currentCell + 1) % ring.cells.length];

			var prevBlockStyle = cell.blockStyle;

			cell.blockStyle = nextCell.blockStyle;
			cell.state = CellState.SWAP_RIGHT;
			cell.rotation[1] += ringRotation;
			cell.currentSwapTime = 0;

			nextCell.blockStyle = prevBlockStyle;
			nextCell.state = CellState.SWAP_LEFT;
			nextCell.rotation[1] -= ringRotation;
			nextCell.currentSwapTime = 0;
		}

		function update(deltaTime, now) {
			for (var i = 0; i < rings.length; i++) {
				var cells = rings[i].cells;
				for (var j = 0; j < cells.length; j++) {
					var cell = cells[j];
					if (cell.state == CellState.SWAP_LEFT || cell.state == CellState.SWAP_RIGHT) {
						var time = deltaTime;
						if (cell.currentSwapTime + deltaTime > swapMovementDuration) {
							time = swapMovementDuration - cell.currentSwapTime;
						}

						var rotationDelta = ringRotation * time / swapMovementDuration;
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

			if (selectorDirection !== Direction.NONE) {
				if (currentSelectorMovementPeriod + deltaTime > maxSelectorMovementPeriod) {
					deltaTime = maxSelectorMovementPeriod - currentSelectorMovementPeriod;
				}

				var verticalTranslation = deltaTime * ringTranslation / maxSelectorMovementPeriod;
				var horizontalRotation = deltaTime * ringRotation / maxSelectorMovementPeriod;

				switch (selectorDirection) {
					case Direction.UP:
						selectorTranslation[1] += verticalTranslation;
						break;

					case Direction.DOWN:
						selectorTranslation[1] -= verticalTranslation;
						break;

					case Direction.LEFT:
						rotation[1] += horizontalRotation;
						break;

					case Direction.RIGHT:
						rotation[1] -= horizontalRotation;
						break;
				}

				currentSelectorMovementPeriod += deltaTime;
				if (currentSelectorMovementPeriod >= maxSelectorMovementPeriod) {
					selectorDirection = Direction.NONE;
					currentSelectorMovementPeriod = 0;
				}
			}

			updateBoardMatrix();
			updateSelectorMatrix(now);
		}

		function updateBoardMatrix() {
			var rotationXMatrix = BC.Matrix.makeXRotation(rotation[0]);
			var rotationYMatrix = BC.Matrix.makeYRotation(rotation[1]);
			var rotationZMatrix = BC.Matrix.makeZRotation(rotation[2]);

			var matrix = BC.Matrix.matrixMultiply(scaleMatrix, rotationZMatrix);
			matrix = BC.Matrix.matrixMultiply(matrix, rotationYMatrix);
			matrix = BC.Matrix.matrixMultiply(matrix, rotationXMatrix);
			model.boardMatrix = matrix;
		}

		function updateSelectorMatrix(now) {
			var scale = 1 + Math.abs(Math.sin(4 * now)) / 25;
			var scaleMatrix = BC.Matrix.makeScale(scale, scale, 1);
			var translationMatrix = BC.Matrix.makeTranslation(
					selectorTranslation[0],
					selectorTranslation[1],
					selectorTranslation[2]);
			var matrix = BC.Matrix.matrixMultiply(scaleMatrix, translationMatrix);
			model.selectorMatrix = matrix;
		}

		return model;
	};

	return parent;

}(BC || {}))
