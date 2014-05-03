var BC = (function(parent) {

	var module = parent.Cell = parent.Cell || {}
	var my = module.Drop = module.Drop || {}

	my.makeManager = function(metrics) {
		var CellState = BC.Cell.CellState;
		var Direction = BC.Constants.Direction;

		var DROP_DURATION = 0.05;

		function update(board) {
			for (var i = 0; i < board.rings.length; i++) {
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
			if (downRow >= board.rings.length) {
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