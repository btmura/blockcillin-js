var BC = (function(parent) {

	var my = parent.Board = parent.Board || {}

	/**
	 * Makes a board which tracks the state of all the blocks.
	 *
	 * @param specs.numRingCells - number of cells in each ring
	 * @param specs.numBlockStyles - number of block styles
	 * @returns {Object} board that tracks the state of all the blocks
	 */
	my.makeBoard = function(specs) {
		var cells = [];

		function makeCell() {
			var blockStyle = BC.Math.randomInt(0, specs.numBlockStyles);
			return {
				blockStyle: blockStyle,
			};
		}

		for (var i = 0; i < specs.numRingCells; i++) {
			cells[i] = makeCell();
		}

		return {};
	};

	return parent;

}(BC || {}))
