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
		var Log = BC.Log;
		var Matrix = BC.Math.Matrix;
		var Sound = BC.Audio.Sound;

		var metrics = args.metrics;
		var config = args.config;
		var audioPlayer = args.audioPlayer;

		var updatesPerFlicker = config.getUpdatesPerFlicker();
		var updatesPerFreeze = config.getUpdatesPerFreeze();
		var updatesPerFade = config.getUpdatesPerFade();
		var updatesPerSwap = config.getUpdatesPerSwap();

		var totalRotationDelta = BC.Math.sliceRadians(metrics.numCells);
		var rotationDelta = totalRotationDelta / updatesPerSwap;
		var totalTranslationDelta = metrics.ringHeight;
		var translationDelta = totalTranslationDelta / updatesPerSwap;
		var alphaDelta = 1 / updatesPerFade;

		var currentState = {
			state: args.state,
			blockStyle: args.blockStyle,
			yellowBoost: 0,
			alpha: 1,
			droppingBlock: false,
			rotation: [0, args.rotationY, 0],
			translation: [0, 0, 0]
		};

		var drawState = {
			rotation: [0, 0, 0],
			translation: [0, 0, 0]
		};

		function updateDrawState() {
			drawState.state = currentState.state;
			drawState.blockStyle = currentState.blockStyle;
			drawState.yellowBoost = currentState.yellowBoost;
			drawState.alpha = currentState.alpha;
			drawState.droppingBlock = currentState.droppingBlock;
			for (var i = 0; i < 3; i++) {
				drawState.rotation[i] = currentState.rotation[i];
				drawState.translation[i] = currentState.translation[i];
			}
		}

		var stateManager = BC.StateManager.make();

		var flickerStateMutator = {
			totalUpdates: updatesPerFlicker,

			onStart: function(state, stepPercent) {
				state.state = CellState.BLOCK_CLEARING_PREPARING;
			},

			onUpdate: function(state, stepPercent, update) {
				state.yellowBoost = config.getYellowBoost(update + stepPercent);
			},

			onFinish: function(state) {
				state.yellowBoost = 0;
			}
		};

		var freezeStateMutator = {
			totalUpdates: updatesPerFreeze,

			onStart: function(state, stepPercent) {
				state.blockStyle += metrics.numBlockTypes;
			},

			onFinish: function(state) {
				state.state = CellState.BLOCK_CLEARING_READY;
			}
		};

		var fadeOutStateMutator = {
			totalUpdates: updatesPerFade,

			onStart: function(state, stepPercent) {
				audioPlayer.play(Sound.CELL_CLEAR);
			},

			onUpdate: function(state, stepPercent) {
				state.alpha -= alphaDelta;
			},

			onFinish: function(state) {
				state.state = CellState.EMPTY_NO_DROP;
				state.alpha = 1;
			}
		};

		var sendStateMutator = {
			totalUpdates: config.getUpdatesPerSwap(),

			onFinish: function(state) {
				state.state = CellState.EMPTY;
			}
		};

		var receiveDirectionStateMutators = {};

		receiveDirectionStateMutators[Direction.UP] = {
			totalUpdates: updatesPerSwap,

			onStart: function(state, stepPercent) {
				state.translation[1] = metrics.ringHeight;
				state.droppingBlock = true;
			},

			onUpdate: function(state, stepPercent) {
				state.translation[1] -= translationDelta * stepPercent;
			},

			onFinish: function(state) {
				state.state = CellState.BLOCK;
				state.droppingBlock = false;
			}
		};

		receiveDirectionStateMutators[Direction.LEFT] = {
			totalUpdates: updatesPerSwap,

			onStart: function(state, stepPercent) {
				state.rotation[1] -= totalRotationDelta;
			},

			onUpdate: function(state, stepPercent) {
				state.rotation[1] += rotationDelta * stepPercent;
			},

			onFinish: function(state) {
				state.state = CellState.BLOCK;
			}
		};

		receiveDirectionStateMutators[Direction.RIGHT] = {
			totalUpdates: updatesPerSwap,

			onStart: function(state, stepPercent) {
				state.rotation[1] += totalRotationDelta;
			},

			onUpdate: function(state, stepPercent) {
				state.rotation[1] -= rotationDelta * stepPercent;
			},

			onFinish: function(state) {
				state.state = CellState.BLOCK;
			}
		};

		function markBlock() {
			currentState.state = CellState.BLOCK_CLEARING_MARKED;
			stateManager.addStateMutator(flickerStateMutator);
			stateManager.addStateMutator(freezeStateMutator);
		}

		function clearBlock() {
			currentState.state = CellState.BLOCK_CLEARING_IN_PROGRESS;
			stateManager.addStateMutator(fadeOutStateMutator);
		}

		function sendBlock() {
			var blockStyle = currentState.blockStyle;
			currentState.blockStyle = 0;
			currentState.state = CellState.EMPTY_NO_SWAP;
			stateManager.addStateMutator(sendStateMutator);
			return blockStyle;
		}

		function receiveBlock(direction, blockStyle) {
			currentState.blockStyle = blockStyle;
			currentState.state = CellState.BLOCK_RECEIVING;
			stateManager.addStateMutator(receiveDirectionStateMutators[direction]);
		}

		function getState() {
			return currentState.state;
		}

		function setState(newState) {
			currentState.state = newState;
		}

		function getBlockStyle() {
			return currentState.blockStyle;
		}

		function setBlockStyle(newBlockStyle) {
			currentState.blockStyle = newBlockStyle;
		}

		function isClearing() {
			return currentState.state === CellState.BLOCK_CLEARING_MARKED
					|| currentState.state === CellState.BLOCK_CLEARING_PREPARING
					|| currentState.state === CellState.BLOCK_CLEARING_READY
					|| currentState.state === CellState.BLOCK_CLEARING_IN_PROGRESS
		}

		function hasDroppingBlock() {
			return currentState.droppingBlock;
		}

		function update() {
			updateState(currentState, 1);
		}

		function getDrawSpec(lagFactor) {
			updateDrawState();
			updateState(drawState, lagFactor);

			var matrix = getMatrix(drawState, lagFactor);
			var isDrawable = getDrawable(drawState);
			var isTransparent = getTransparent(drawState);
			return {
				matrix: matrix,
				blockStyle: drawState.blockStyle,
				yellowBoost: drawState.yellowBoost,
				alpha: drawState.alpha,
				isDrawable: isDrawable,
				isTransparent: isTransparent
			}
		}

		function updateState(state, stepPercent) {
			stateManager.updateState(state, stepPercent);
		}

		function getMatrix(state, lagFactor) {
			var rotationMatrix = Matrix.makeYRotation(state.rotation[1]);
			var translationMatrix = Matrix.makeTranslation(state.translation[0], state.translation[1], state.translation[2]);
			return Matrix.matrixMultiply(rotationMatrix, translationMatrix);
		}

		function getDrawable(state) {
			return state.state !== CellState.EMPTY
					&& state.state !== CellState.EMPTY_NO_SWAP
					&& state.state !== CellState.EMPTY_NO_DROP;
		}

		function getTransparent(state) {
			return state.state === CellState.BLOCK_CLEARING_IN_PROGRESS;
		}

		return {
			markBlock: markBlock,
			clearBlock: clearBlock,
			sendBlock: sendBlock,
			receiveBlock: receiveBlock,

			getState: getState,
			setState: setState,
			getBlockStyle: getBlockStyle,
			setBlockStyle: setBlockStyle,

			isClearing: isClearing,
			hasDroppingBlock: hasDroppingBlock,

			update: update,
			getDrawSpec: getDrawSpec
		};
	};

	return root;

}(BC || {}))