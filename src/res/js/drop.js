/*
 * Copyright (C) 2014  Brian Muramatsu
 *
 * This file is part of blockcillin.
 *
 * blockcillin is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * blockcillin is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with blockcillin.  If not, see <http://www.gnu.org/licenses/>.
 */

var BC = (function(root) {

	var me = root.Drop = root.Drop || {};

	me.makeManager = function(metrics) {
		var CellState = BC.Cell.CellState;
		var Direction = BC.Direction;

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
			if (cell.getState() !== CellState.BLOCK) {
				return;
			}

			var downRow = row + 1;
			if (downRow >= board.rings.length) {
				return;
			}
			var downCell = getCell(board, downRow, col);

			if (cell.getState() === CellState.BLOCK && downCell.getState() == CellState.EMPTY) {
				var blockStyle = cell.sendBlock();
				downCell.receiveBlock(Direction.UP, blockStyle);
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