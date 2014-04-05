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

		var rings = [];

		var selectorDirection = Direction.NONE;
		var currentSelectorMovementPeriod = 0;
		var maxSelectorMovementPeriod = 0.05;
		var currentRing = 0;

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

			var rotationY = cellIndex * ringRotation;
			var matrix = BC.Matrix.makeYRotation(rotationY);

			return {
				blockStyle: blockStyle,
				matrix: matrix
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
			}
		}

		function moveSelectorRight() {
			if (selectorDirection === Direction.NONE) {
				selectorDirection = Direction.RIGHT;
				currentSelectorMovementPeriod = 0;
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

		}

		function update(deltaTime) {
			updateBoardMatrix();
			updateSelectorMatrix();

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

		function updateSelectorMatrix() {
			// var scale = 1; // + Math.abs(Math.sin(4 * now)) / 50;
			// var scaleMatrix = BC.Matrix.makeScale(scale, scale, 1);
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
