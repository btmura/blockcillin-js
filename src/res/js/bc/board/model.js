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
		var rings = [];

		var numRings = 1;
		for (var i = 0; i < numRings; i++) {
			rings[i] = makeRing();
		}

		function makeRing() {
			var cells = [];
			for (var i = 0; i < specs.numRingCells; i++) {
				cells[i] = makeCell();
			}
			return {
				cells: cells
			};
		}

		function makeCell() {
			var blockStyle = BC.Math.randomInt(specs.numBlockStyles);
			return {
				blockStyle: blockStyle,
			};
		}

		return {
			rings: rings,
			numRingCells: specs.numRingCells,
			innerRingRadius: specs.innerRingRadius,
			outerRingRadius: specs.outerRingRadius,
			ringMaxY: specs.ringMaxY,
			ringMinY: specs.ringMinY
		};
	};

	return parent;

}(BC || {}))
