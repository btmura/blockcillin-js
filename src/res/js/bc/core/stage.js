var BC = (function(root) {

	var parent = root.Core = root.Core || {};
	var me = parent.Stage = parent.Stage || {};

	me.make = function(metrics, translationY) {
		// Translate the stage up to the top of the ring.
		translationY += metrics.ringHeight / 2 - 0.01;

		var matrix = BC.Common.Matrix.makeTranslation(0, translationY, 0);

		return {
			matrix: matrix
		};
	};

	return root;

}(BC || {}))