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
		var Sound = BC.Audio.Sound;

		// TODO(btmura): remove duplication with board.js and move them to config module
		var SCALE_AMPLITUDE_DIVISOR = 25;
		var SCALE_SPEED_MULTIPLIER = 0.035;

		var metrics = args.metrics;
		var config = args.config;
		var board = args.board;
		var audioPlayer = args.audioPlayer;

		var updatesPerMove = config.getUpdatesPerMove();
		var translationDelta = metrics.ringHeight / updatesPerMove;
		var stateManager = BC.StateManager.make();
		var animations = [];

		var currentState = {
			direction: Direction.NONE,
			scale: [1, 1, 1],
			translation: [0, 0, 0],
			scaleAccumulator: 0
		};

		var moveUpStateMutator = {
			totalUpdates: updatesPerMove,

			onStart: function(state, stepPercent) {
				state.direction = Direction.UP;
				if (stepPercent === 1) {
					audioPlayer.play(Sound.SELECTOR_MOVEMENT);
				}
			},

			onUpdate: function(state, stepPercent) {
				state.translation[1] += getTranslationDelta(stepPercent);
			},

			onFinish: function(state) {
				state.direction = Direction.NONE;
			},
		};

		var moveDownStateMutator = {
			totalUpdates: updatesPerMove,

			onStart: function(state, stepPercent) {
				state.direction = Direction.DOWN;
				if (stepPercent === 1) {
					audioPlayer.play(Sound.SELECTOR_MOVEMENT);
				}
			},

			onUpdate: function(state, stepPercent) {
				state.translation[1] -= getTranslationDelta(stepPercent);
			},

			onFinish: function(state) {
				state.direction = Direction.NONE;
			},
		};

		function getTranslationDelta(percent) {
			return translationDelta * percent;
		}

		function update() {
			BC.Animation.process(animations);
			updateState(currentState, 1);
		}

		function getDrawSpec(lagFactor) {
			var state = cloneState(currentState);
			updateState(state, lagFactor);

			var matrix = getMatrix(state, lagFactor);
			return {
				matrix: matrix
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
				scaleAccumulator: state.scaleAccumulator
			};
		}

		function getMatrix(state, lagFactor) {
			var scaleMatrix = getScaleMatrix(state, lagFactor);
			var translationMatrix = getTranslationMatrix(state, lagFactor);
			return BC.Math.Matrix.matrixMultiply(scaleMatrix, translationMatrix);
		}

		function getScaleMatrix(state, lagFactor) {
			state.scale[0] = state.scale[1] = 1 + Math.abs(Math.sin(state.scaleAccumulator * SCALE_SPEED_MULTIPLIER)) / SCALE_AMPLITUDE_DIVISOR;
			return BC.Math.Matrix.makeScale(state.scale[0], state.scale[1], state.scale[2]);
		}

		function getTranslationMatrix(state, lagFactor) {
			return BC.Math.Matrix.makeTranslation(state.translation[0], state.translation[1], state.translation[2]);
		}

		function move(direction) {
			switch (direction) {
				case Direction.LEFT:
					return moveLeft();

				case Direction.RIGHT:
					return moveRight();

				case Direction.UP:
					return moveUp();

				case Direction.DOWN:
					return moveDown();

				default:
					BC.Log.error("move: unsupported direction: " + direction);
					return false;
			}
		}

		function moveLeft() {
			if (!isMoving()) {
				startMoving(Direction.LEFT);
				return true;
			}
			return false;
		}

		function moveRight() {
			if (!isMoving()) {
				startMoving(Direction.RIGHT);
				return true;
			}
			return false;
		}

		function moveUp() {
			if (!isMoving()) {
				startMoving(Direction.UP);
				return true;
			}
			return false;
		}

		function moveDown() {
			if (!isMoving()) {
				startMoving(Direction.DOWN);
				return true;
			}
			return false;
		}

		function isMoving() {
			return currentState.direction !== Direction.NONE;
		}

		function startMoving(newDirection) {
			currentState.direction = newDirection;
			if (newDirection === Direction.UP) {
				stateManager.addStateMutator(moveUpStateMutator);
			} else if (newDirection === Direction.DOWN) {
				stateManager.addStateMutator(moveDownStateMutator);
			} else {
				if (animations.length > 0) {
					BC.Log.error("startMoving: pending animations: " + animations.length);
				}
				animations.push(BC.Animation.make({
					numUpdates: updatesPerMove,
					updateCallback: function() {
						switch (currentState.direction) {
							case Direction.LEFT:
								board.rotate(Direction.LEFT);
								return true;

							case Direction.RIGHT:
								board.rotate(Direction.RIGHT);
								return true;

							default:
								return false;
						}
					},
					finishCallback: function() {
						currentState.direction = Direction.NONE;
						board.rotate(Direction.NONE);
						audioPlayer.play(Sound.SELECTOR_MOVEMENT);
					}
				}));
			}
		}

		return {
			update: update,
			getDrawSpec: getDrawSpec,
			move: move
		};
	};

	return root;

}(BC || {}))