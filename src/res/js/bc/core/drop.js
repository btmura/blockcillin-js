var BC = (function(root) {

	var parent = root.Core = root.Core || {};
	var me = parent.Drop = parent.Drop || {};

	me.makeManager = function(metrics) {
		var CellState = BC.Core.Cell.CellState;
		var Direction = BC.Common.Direction;

		var DROP_DURATION = 0.05;

		var dropQueue = [];

		function update(board) {
			for (var i = 0; i < board.rings.length; i++) {
				for (var j = 0; j < metrics.numCells; j++) {
					tryDropping(board, i, j);
				}
			}
			return updateDropQueue();
		}

		function tryDropping(board, row, col) {
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
				dropQueue.push(downCell);
			}
		}

		function updateDropQueue() {
			while (dropQueue.length > 0) {
				var cell = dropQueue[0];
				if (cell.hasDroppingBlock()) {
					return true;
				}
				dropQueue.shift();
			}
			return false;
		}

		function getCell(board, row, col) {
			return board.rings[row].cells[col];
		}

		return {
			update: update
		};
	};

	return root;

}(BC || {}))