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

		var numRings = 3;
		for (var i = 0; i < numRings; i++) {
			rings[i] = makeRing();
		}

		function makeRing() {
			var cells = [];
			for (var i = 0; i < specs.numRingCells; i++) {
				cells[i] = makeCell(i);
			}
			return {
				cells: cells
			};
		}

		function makeCell(cellIndex) {
			var blockStyle = BC.Math.randomInt(specs.numBlockStyles);
			var cellYRotation = cellIndex * ringRotation;
			var matrix = BC.Matrix.makeYRotation(cellYRotation);
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

		return {
			rings: rings,
			numRingCells: specs.numRingCells,
			innerRingRadius: specs.innerRingRadius,
			outerRingRadius: specs.outerRingRadius,
			ringMaxY: specs.ringMaxY,
			ringMinY: specs.ringMinY,
			selectorTranslation: selectorTranslation,
			rotation: rotation,

			move: move,
			swap: swap,
			update: update,
		};
	};

	return parent;

}(BC || {}))
