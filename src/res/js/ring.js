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

	var me = root.Ring = root.Ring || {};

	me.make = function(args) {
		var CellState = BC.Cell.CellState;

		var metrics = args.metrics;
		var config = args.config;
		var translationY = args.translationY;
		var selectable = args.selectable;
		var audioPlayer = args.audioPlayer;

		// How much to rotate each cell by to form a ring of cells.
		var RING_ROTATION_Y_DELTA = BC.Math.sliceRadians(metrics.numCells);

		var matrix = BC.Math.Matrix.makeTranslation(0, translationY, 0);

		var state = selectable ? CellState.BLOCK : CellState.BLOCK_INCOMING;

		var theta = 2 * Math.PI / metrics.numCells;
		var cells = [];
		for (var i = 0; i < metrics.numCells; i++) {
			var rotationY = i * RING_ROTATION_Y_DELTA + theta/2;
			cells[i] = BC.Cell.make({
				metrics: metrics,
				config: config,
				audioPlayer: audioPlayer,
				state: state,
				rotationY: rotationY,
			});
		}

		function isEmpty() {
			for (var i = 0; i < cells.length; i++) {
				if (cells[i].getState() !== BC.Cell.CellState.EMPTY) {
					return false;
				}
			}

			return true;
		}

		function setSelectable(newSelectable) {
			if (!selectable && newSelectable) {
				for (var i = 0; i < cells.length; i++) {
					// TODO(btmura): create function on Cell to change selectable state
					if (cells[i].getState() === BC.Cell.CellState.BLOCK_INCOMING) {
						cells[i].setState(BC.Cell.CellState.BLOCK);
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

	return root;

}(BC || {}))