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

		var MOVEMENT_UPDATE_COUNT = 10;
		var SCALE_AMPLITUDE_DIVISOR = 25;
		var SCALE_SPEED_MULTIPLIER = 0.035;

		var metrics = args.metrics;
		var board = args.board;
		var audioPlayer = args.audioPlayer;

		var selector = {
			matrix: BC.Math.Matrix.identity,
			move: move,
			update: update
		};

		var direction = Direction.NONE;
		var animations = [];
		var translation = [0, 0, 0];
		var ringRotationY = BC.Math.sliceRadians(metrics.numCells);
		var scaleCounter = 0;

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
					Log.error("move: unsupported direction: " + direction);
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
				Log.error("startMoving: pending animations: " + animations.length);
			}

			animations.push(BC.Animation2.make({
				numUpdates: MOVEMENT_UPDATE_COUNT,
				updateCallback: function() {
					var translationDelta = metrics.ringHeight / MOVEMENT_UPDATE_COUNT;
					var rotationDelta = ringRotationY / MOVEMENT_UPDATE_COUNT;

					switch (direction) {
						case Direction.UP:
							translation[1] += translationDelta;
							return true;

						case Direction.DOWN:
							translation[1] -= translationDelta;
							return true;

						case Direction.LEFT:
							board.rotate(rotationDelta);
							return true;

						case Direction.RIGHT:
							board.rotate(-rotationDelta);
							return true;

						default:
							return false;
					}
				},
				finishCallback: function() {
					direction = Direction.NONE;
					audioPlayer.play(Sound.SELECTOR_MOVEMENT);
				}
			}));
		}

		function update() {
			BC.Animation2.process(animations);
			updateSelectorMatrix();
		}

		function updateSelectorMatrix() {
			var scale = 1 + Math.abs(Math.sin(scaleCounter * SCALE_SPEED_MULTIPLIER)) / SCALE_AMPLITUDE_DIVISOR;
			scaleCounter++;

			var scaleMatrix = Matrix.makeScale(scale, scale, 1);
			var translationMatrix = Matrix.makeTranslation(
					translation[0],
					translation[1],
					translation[2]);
			selector.matrix = Matrix.matrixMultiply(scaleMatrix, translationMatrix);
		}

		return selector;
	};

	return root;

}(BC || {}))