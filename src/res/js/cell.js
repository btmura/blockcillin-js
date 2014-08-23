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

	var me = root.Cell = root.Cell || {};

	me.CellState = {
		EMPTY: "EMPTY",
		EMPTY_NO_SWAP: "EMPTY_NO_SWAP",
		EMPTY_NO_DROP: "EMPTY_NO_DROP",

		BLOCK: "BLOCK",
		BLOCK_INCOMING: "BLOCK_INCOMING",
		BLOCK_RECEIVING: "BLOCK_RECEIVING",

		BLOCK_CLEARING_MARKED: "BLOCK_CLEARING_MARKED",
		BLOCK_CLEARING_PREPARING: "BLOCK_CLEARING_PREPARING",
		BLOCK_CLEARING_READY: "BLOCK_CLEARING_READY",
		BLOCK_CLEARING_IN_PROGRESS: "BLOCK_CLEARING_IN_PROGRESS"
	};

	me.make = function(args) {
		var CellState = BC.Cell.CellState;
		var Direction = BC.Direction;
		var Sound = BC.Audio.Sound;

		var metrics = args.metrics;
		var rotationY = args.rotationY;
		var state = args.state;
		var blockStyle = args.blockStyle;
		var audioPlayer = args.audioPlayer;

		var FLICKER_UPDATE_COUNT = 60;
		var FREEZE_UPDATE_COUNT = 30;
		var FADE_OUT_COUNT = 30;
		var ROTATION_Y_DELTA = BC.Math.sliceRadians(metrics.numCells);
		var TRANSLATION_Y_DELTA = metrics.ringHeight;
		var YELLOW_BOOST_SPEED_MULTIPLIER = 75;
		var YELLOW_BOOST_AMPLITUDE_DIVISOR = 2;

		var animations = [];
		var droppingBlock = false;

		var rotation = [0, rotationY, 0];
		var translation = [0, 0, 0];
		var matrix = BC.Math.Matrix.makeYRotation(rotation[1]);

		var cell = {
			matrix: matrix,
			state: state,
			blockStyle: blockStyle,
			yellowBoost: 0,
			alpha: 1,

			markBlock: markBlock,
			clearBlock: clearBlock,
			sendBlock: sendBlock,
			receiveBlock: receiveBlock,

			isClearing: isClearing,
			isDrawable : isDrawable,
			isTransparent: isTransparent,
			hasDroppingBlock: hasDroppingBlock,
			update: update
		};

		function markBlock() {
			cell.state = CellState.BLOCK_CLEARING_MARKED;
			if (animations.length > 0) {
				BC.Log.error("markBlock: pending animations: " + animations.length);
			}

			var flicker = BC.Animation2.make({
				numUpdates: FLICKER_UPDATE_COUNT,
				startCallback: function() {
					cell.state = CellState.BLOCK_CLEARING_PREPARING;
				},
				updateCallback: function(update) {
					cell.yellowBoost = Math.abs(Math.sin(update * YELLOW_BOOST_SPEED_MULTIPLIER) / YELLOW_BOOST_AMPLITUDE_DIVISOR);
					return false;
				},
				finishCallback: function() {
					cell.yellowBoost = 0;
				}
			});

			var freeze = BC.Animation2.make({
				numUpdates: FREEZE_UPDATE_COUNT,
				startCallback: function() {
					cell.blockStyle += metrics.numBlockTypes;
				},
				finishCallback: function() {
					cell.state = CellState.BLOCK_CLEARING_READY;
				}
			});

			animations.push(flicker, freeze);
		}

		function clearBlock() {
			cell.state = CellState.BLOCK_CLEARING_IN_PROGRESS;
			if (animations.length > 0) {
				BC.Log.error("clearBlock: pending animations: " + animations.length);
			}

			var fadeOut = BC.Animation2.make({
				numUpdates: FADE_OUT_COUNT,
				startCallback: function() {
					audioPlayer.play(Sound.CELL_CLEAR);
				},
				updateCallback: function(update) {
					cell.alpha = 1.0 - update / FADE_OUT_COUNT;
					return false;
				},
				finishCallback: function() {
					cell.state = CellState.EMPTY_NO_DROP;
					cell.alpha = 1;
				}
			});

			animations.push(fadeOut);
		}

		function sendBlock(updateCount) {
			var blockStyle = cell.blockStyle;

			cell.blockStyle = 0;
			cell.state = CellState.EMPTY_NO_SWAP;

			if (animations.length > 0) {
				BC.Log.error("sendBlock: pending animations: " + animations.length);
			}

			animations.push(BC.Animation2.make({
				numUpdates: updateCount,
				finishCallback: function() {
					cell.state = CellState.EMPTY;
				}
			}));
			return blockStyle;
		}

		function receiveBlock(updateCount, direction, blockStyle) {
			cell.blockStyle = blockStyle;
			cell.state = CellState.BLOCK_RECEIVING;

			switch (direction) {
				case Direction.LEFT:
					rotation[1] -= ROTATION_Y_DELTA;
					break;

				case Direction.RIGHT:
					rotation[1] += ROTATION_Y_DELTA;
					break;

				case Direction.UP:
					translation[1] = metrics.ringHeight;
					// TODO(btmura): add a specific method to handle drops
					droppingBlock = true;
					break;

				default:
					BC.Log.error("receiveBlock: unsupport direction: " + direction);
					break;
			}
			updateCellMatrix();

			if (animations.length > 0) {
				BC.Log.error("receiveBlock: pending animations: " + animations.length);
			}

			animations.push(BC.Animation2.make({
				numUpdates: updateCount,
				updateCallback: function(update) {
					var rotationDelta = ROTATION_Y_DELTA / updateCount;
					var translationDelta = TRANSLATION_Y_DELTA / updateCount;
					switch (direction) {
						case Direction.LEFT:
							rotation[1] += rotationDelta;
							return true;

						case Direction.RIGHT:
							rotation[1] -= rotationDelta;
							return true;

						case Direction.UP:
							translation[1] -= translationDelta;
							return true;

						default:
							return false;
					}
				},
				finishCallback: function() {
					cell.state = CellState.BLOCK;
					droppingBlock = false;
				}
			}));
		}

		function isClearing() {
			return cell.state === CellState.BLOCK_CLEARING_MARKED
					|| cell.state === CellState.BLOCK_CLEARING_PREPARING
					|| cell.state === CellState.BLOCK_CLEARING_READY
					|| cell.state === CellState.BLOCK_CLEARING_IN_PROGRESS
		}

		function isDrawable() {
			return cell.state !== CellState.EMPTY
					&& cell.state !== CellState.EMPTY_NO_SWAP
					&& cell.state !== CellState.EMPTY_NO_DROP;
		}

		function isTransparent() {
			return cell.state === CellState.BLOCK_CLEARING_IN_PROGRESS;
		}

		function hasDroppingBlock() {
			return droppingBlock;
		}

		function update(watch) {
			var needMatrixUpdate = BC.Animation2.process(animations);
			if (needMatrixUpdate) {
				updateCellMatrix();
			}
		}

		function updateCellMatrix() {
			var rotationMatrix = BC.Math.Matrix.makeYRotation(rotation[1]);
			var translationMatrix = BC.Math.Matrix.makeTranslation(
					translation[0],
					translation[1],
					translation[2]);
			cell.matrix = BC.Math.Matrix.matrixMultiply(rotationMatrix, translationMatrix);
		}

		return cell;
	};

	return root;

}(BC || {}))