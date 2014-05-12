var BC = (function(parent) {

	var my = parent.Ring = parent.Ring || {}

	my.make = function(args) {
		var CellState = BC.Cell.CellState;

		var metrics = args.metrics;
		var translationY = args.translationY;
		var selectable = args.selectable;

		// How much to rotate each cell by to form a ring of cells.
		var RING_ROTATION_Y_DELTA = BC.Math.sliceRadians(metrics.numCells);

		var matrix = BC.Matrix.makeTranslation(0, translationY, 0);

		var state = selectable ? CellState.BLOCK : CellState.BLOCK_INCOMING;

		var cells = [];
		for (var i = 0; i < metrics.numCells; i++) {
			var rotationY = i * RING_ROTATION_Y_DELTA;

			var blockStyle = BC.Math.randomInt(metrics.numBlockTypes);
			if (!selectable) {
				blockStyle += metrics.numBlockTypes * 2;
			}

			cells[i] = BC.Cell.make({
				metrics: metrics,
				rotationY: rotationY,
				state: state,
				blockStyle: blockStyle
			});
		}

		function isEmpty() {
			for (var i = 0; i < cells.length; i++) {
				if (cells[i].state !== BC.Cell.CellState.EMPTY) {
					return false;
				}
			}

			return true;
		}

		function setSelectable(newSelectable) {
			if (!selectable && newSelectable) {
				for (var i = 0; i < cells.length; i++) {
					// TODO(btmura): create function on Cell to change selectable state
					if (cells[i].state === BC.Cell.CellState.BLOCK_INCOMING) {
						cells[i].state = BC.Cell.CellState.BLOCK;
						// TODO(btmura): remove manual multiplication to change texture
						cells[i].blockStyle -= metrics.numBlockTypes * 2;
					}
				}
			}
			selectable = newSelectable;
		}

		function isSelectable() {
			return selectable;
		}

		return {
			matrix: matrix,
			cells: cells,
			isEmpty: isEmpty,
			setSelectable: setSelectable,
			isSelectable: isSelectable
		};
	};

	return parent;

}(BC || {}))