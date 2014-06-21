var BC = (function(root) {

	var me = root.Selector = root.Selector || {};

	me.make = function(args) {
		var metrics = args.metrics;
		var board = args.board;
		var audioPlayer = args.audioPlayer;

		var Direction = BC.Common.Direction;
		var Sound = BC.Audio.Sound;

		var MOVEMENT_DURATION = 0.025;

		var selector = {
			matrix: BC.Common.Matrix.identity,
			move: move,
			update: update
		};

		var direction = Direction.NONE;
		var animations = [];
		var translation = [0, 0, 0];
		var ringRotationY = BC.Common.Math.sliceRadians(metrics.numCells);

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
					BC.Common.Log.error("move: unsupported direction: " + direction);
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
				BC.Common.Log.error("startMoving: pending animations: " + animations.length);
			}

			animations.push(BC.Common.Animation.make({
				duration: MOVEMENT_DURATION,
				updateCallback: function(watch) {
					var translationDelta = metrics.ringHeight * watch.deltaPercent;
					var rotationDelta = ringRotationY * watch.deltaPercent;

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

		function update(watch) {
			BC.Common.Animation.process(animations, watch);
			updateSelectorMatrix(watch);
		}

		function updateSelectorMatrix(watch) {
			var scale = 1 + Math.abs(Math.sin(4 * watch.now)) / 25;
			var scaleMatrix = BC.Common.Matrix.makeScale(scale, scale, 1);
			var translationMatrix = BC.Common.Matrix.makeTranslation(
					translation[0],
					translation[1],
					translation[2]);
			selector.matrix = BC.Common.Matrix.matrixMultiply(scaleMatrix, translationMatrix);
		}

		return selector;
	};

	return root;

}(BC || {}))