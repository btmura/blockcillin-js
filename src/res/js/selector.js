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
		var MOVEMENT_UPDATE_COUNT = 10;
		var SCALE_AMPLITUDE_DIVISOR = 25;
		var SCALE_SPEED_MULTIPLIER = 0.035;

		var metrics = args.metrics;
		var board = args.board;
		var audioPlayer = args.audioPlayer;

		var direction = Direction.NONE;
		var animations = [];

		var translationDelta = metrics.ringHeight / MOVEMENT_UPDATE_COUNT;

		var scaleAccumulator = 0;
		var scale = [1, 1, 1];
		var translation = [0, 0, 0];

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
			return direction !== Direction.NONE;
		}

		function startMoving(newDirection) {
			direction = newDirection;
			if (animations.length > 0) {
				BC.Log.error("startMoving: pending animations: " + animations.length);
			}

			animations.push(BC.Animation.make({
				numUpdates: MOVEMENT_UPDATE_COUNT,
				updateCallback: function() {
					switch (direction) {
						case Direction.UP:
							translation[1] += translationDelta;
							return true;

						case Direction.DOWN:
							translation[1] -= translationDelta;
							return true;

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
					direction = Direction.NONE;
					board.rotate(Direction.NONE);
					audioPlayer.play(Sound.SELECTOR_MOVEMENT);
				}
			}));
		}

		function update() {
			BC.Animation.process(animations);
			scaleAccumulator++;
		}

		function getMatrix(lagFactor) {
			var scaleMatrix = getScaleMatrix(lagFactor);
			var translationMatrix = getTranslationMatrix(lagFactor);
			return BC.Math.Matrix.matrixMultiply(scaleMatrix, translationMatrix);
		}

		function getScaleMatrix(lagFactor) {
			scale[0] = scale[1] = 1 + Math.abs(Math.sin((scaleAccumulator + lagFactor) * SCALE_SPEED_MULTIPLIER)) / SCALE_AMPLITUDE_DIVISOR;
			return BC.Math.Matrix.makeScale(scale[0], scale[1], scale[2]);
		}

		function getTranslationMatrix(lagFactor) {
			var adjustedTranslation = translation;
			if (isMoving()) {
				adjustedTranslation = [translation[0], translation[1], translation[2]];
				switch (direction) {
					case BC.Direction.UP:
						adjustedTranslation[1] += translationDelta * lagFactor;
						break;

					case BC.Direction.DOWN:
						adjustedTranslation[1] -= translationDelta * lagFactor;
						break;
				}
			}
			return BC.Math.Matrix.makeTranslation(adjustedTranslation[0], adjustedTranslation[1], adjustedTranslation[2]);
		}

		return {
			move: move,
			update: update,
			getMatrix: getMatrix
		};
	};

	return root;

}(BC || {}))