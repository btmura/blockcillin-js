var BC = (function(parent) {

	var my = parent.Board = parent.Board || {}

	/**
	 * Makes a board's view that can draw itself.
	 *
	 * @param model - board model
	 * @returns {Object} board view
	 */
	my.makeView = function(model) {

		function draw() {
		}

		return {
			draw: draw,
		};
	};

	return parent;

}(BC || {}))
