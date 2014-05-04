var BC = (function(parent) {

	var my = parent.Stage = parent.Stage || {}

	my.make = function(metrics, translationY) {
		// Translate the stage up to the top of the ring.
		translationY += metrics.ringHeight / 2;

		var matrix = BC.Matrix.makeTranslation(0, translationY, 0);

		return {
			matrix: matrix
		};
	};

	return parent;

}(BC || {}))