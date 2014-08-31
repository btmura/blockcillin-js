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

	var me = root.Selector = root.Selector || {};

	me.make = function(args) {
		var Direction = BC.Direction;
		var Log = BC.Log;
		var Matrix = BC.Math.Matrix;
		var Sound = BC.Audio.Sound;

		// TODO(btmura): remove duplication with board.js and move them to config module
		var SCALE_AMPLITUDE_DIVISOR = 25;
		var SCALE_SPEED_MULTIPLIER = 0.035;

		var metrics = args.metrics;
		var config = args.config;
		var audioPlayer = args.audioPlayer;

		var updatesPerMove = config.getUpdatesPerMove();
		var translationDelta = metrics.ringHeight / updatesPerMove;
		var rotationDelta = BC.Math.sliceRadians(metrics.numCells) / updatesPerMove;

		var currentState = {
			direction: Direction.NONE,
			scale: [1, 1, 1],
			translation: [0, 0, 0],
			boardRotation: [0, 0, 0],
			scaleAccumulator: 0
		};

		var stateManager = BC.StateManager.make();
		var directionMutators = {};

		directionMutators[Direction.UP] = {
			totalUpdates: updatesPerMove,

			onStart: function(state, stepPercent) {
				state.direction = Direction.UP;
				playSelectorSound(stepPercent);
			},

			onUpdate: function(state, stepPercent) {
				state.translation[1] += getTranslationDelta(stepPercent);
			},

			onFinish: function(state) {
				state.direction = Direction.NONE;
			},
		};

		directionMutators[Direction.DOWN] = {
			totalUpdates: updatesPerMove,

			onStart: function(state, stepPercent) {
				state.direction = Direction.DOWN;
				playSelectorSound(stepPercent);
			},

			onUpdate: function(state, stepPercent) {
				state.translation[1] -= getTranslationDelta(stepPercent);
			},

			onFinish: function(state) {
				state.direction = Direction.NONE;
			}
		};

		directionMutators[Direction.LEFT] = {
			totalUpdates: updatesPerMove,

			onStart: function(state, stepPercent) {
				state.direction = Direction.LEFT;
				playSelectorSound(stepPercent);
			},

			onUpdate: function(state, stepPercent) {
				state.boardRotation[1] += getRotationDelta(stepPercent);
			},

			onFinish: function(state) {
				state.direction = Direction.NONE;
			}
		};

		directionMutators[Direction.RIGHT] = {
			totalUpdates: updatesPerMove,

			onStart: function(state, stepPercent) {
				state.direction = Direction.RIGHT;
				playSelectorSound(stepPercent);
			},

			onUpdate: function(state, stepPercent) {
				state.boardRotation[1] -= getRotationDelta(stepPercent);
			},

			onFinish: function(state) {
				state.direction = Direction.NONE;
			}
		};

		function playSelectorSound(percent) {
			if (percent === 1) {
				audioPlayer.play(Sound.SELECTOR_MOVEMENT);
			}
		}

		function getTranslationDelta(percent) {
			return translationDelta * percent;
		}

		function getRotationDelta(percent) {
			return rotationDelta * percent;
		}

		function update() {
			updateState(currentState, 1);
		}

		function getDrawSpec(lagFactor) {
			var state = cloneState(currentState);
			updateState(state, lagFactor);

			var matrix = getMatrix(state, lagFactor);
			var boardRotationMatrix = getBoardRotationMatrix(state, lagFactor);
			return {
				matrix: matrix,
				boardRotationMatrix: boardRotationMatrix
			}
		}

		function updateState(state, stepPercent) {
			stateManager.updateState(state, stepPercent);
			currentState.scaleAccumulator += stepPercent;
		}

		function cloneState(state) {
			return {
				direction: state.direction,
				scale: state.scale.slice(),
				translation: state.translation.slice(),
				boardRotation: state.boardRotation.slice(),
				scaleAccumulator: state.scaleAccumulator
			};
		}

		function getMatrix(state, lagFactor) {
			var scaleMatrix = getScaleMatrix(state, lagFactor);
			var translationMatrix = getTranslationMatrix(state, lagFactor);
			return Matrix.matrixMultiply(scaleMatrix, translationMatrix);
		}

		function getScaleMatrix(state, lagFactor) {
			state.scale[0] = state.scale[1] = 1 + Math.abs(Math.sin(state.scaleAccumulator * SCALE_SPEED_MULTIPLIER)) / SCALE_AMPLITUDE_DIVISOR;
			return Matrix.makeScale(state.scale[0], state.scale[1], state.scale[2]);
		}

		function getTranslationMatrix(state, lagFactor) {
			return Matrix.makeTranslation(state.translation[0], state.translation[1], state.translation[2]);
		}

		function getBoardRotationMatrix(state, lagFactor) {
			var rotationXMatrix = Matrix.makeXRotation(state.boardRotation[0]);
			var rotationYMatrix = Matrix.makeYRotation(state.boardRotation[1]);
			var rotationZMatrix = Matrix.makeZRotation(state.boardRotation[2]);

			var matrix = Matrix.matrixMultiply(rotationZMatrix, rotationYMatrix);
			matrix = Matrix.matrixMultiply(matrix, rotationXMatrix);
			return matrix;
		}

		function move(direction) {
			if (!isMoving()) {
				startMoving(direction);
				return true;
			}
			return false;
		}

		function isMoving() {
			return currentState.direction !== Direction.NONE;
		}

		function startMoving(newDirection) {
			currentState.direction = newDirection;
			stateManager.addStateMutator(directionMutators[newDirection]);
		}

		return {
			update: update,
			getDrawSpec: getDrawSpec,
			move: move
		};
	};

	return root;

}(BC || {}))