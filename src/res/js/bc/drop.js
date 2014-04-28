var BC = (function(parent) {

	var my = parent.Drop = parent.Drop || {}

	my.makeManager = function(metrics) {
		var CellState = BC.Cell.CellState;
		var Direction = BC.Constants.Direction;

		var DROP_DURATION = 0.1;

		function update(board) {
			for (var i = 0; i < metrics.numRings; i++) {
				for (var j = 0; j < metrics.numCells; j++) {
					updateBlockDrops(board, i, j);
				}
			}
		}

		function updateBlockDrops(board, row, col) {
			var cell = getCell(board, row, col);
			if (cell.state !== CellState.BLOCK) {
				return;
			}

			var downRow = row + 1;
			if (downRow >= metrics.numRings) {
				return;
			}
			var downCell = getCell(board, downRow, col);

			if (cell.state === CellState.BLOCK && downCell.state == CellState.EMPTY) {
				var blockStyle = cell.sendBlock(DROP_DURATION);
				downCell.receiveBlock(DROP_DURATION, Direction.UP, blockStyle);
			}
		}

		function getCell(board, row, col) {
			return board.rings[row].cells[col];
		}

		return {
			update: update
		};
	};

	return parent;

}(BC || {}))