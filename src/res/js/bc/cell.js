var BC = (function(parent) {

	var my = parent.Cell = parent.Cell || {};

	my.CellState = {
		EMPTY: 0,
		EMPTY_NO_SWAP: 1,
		EMPTY_NO_DROP: 2,

		BLOCK: 3,
		BLOCK_INCOMING: 4,
		BLOCK_RECEIVING: 5,

		BLOCK_CLEARING_MARKED: 6,
		BLOCK_CLEARING_PREPARING: 7,
		BLOCK_CLEARING_READY: 8,
		BLOCK_CLEARING_IN_PROGRESS: 9
	};

	my.make = function(args) {
		var CellState = BC.Cell.CellState;
		var Direction = BC.Constants.Direction;

		var metrics = args.metrics;
		var rotationY = args.rotationY;
		var state = args.state;
		var blockStyle = args.blockStyle;

		var FLICKER_DURATION = 0.5;
		var FREEZE_DURATION = 0.25;
		var FADE_OUT_DURATION = 0.25;
		var ROTATION_Y_DELTA = BC.Math.sliceRadians(metrics.numCells);

		var animations = [];
		var droppingBlock = false;

		var rotation = [0, rotationY, 0];
		var translation = [0, 0, 0];
		var matrix = BC.Matrix.makeYRotation(rotation[1]);

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
				BC.Util.error("markBlock: pending animations: " + animations.length);
			}

			var flicker = BC.Animation.make({
				duration: FLICKER_DURATION,
				startCallback: function() {
					cell.state = CellState.BLOCK_CLEARING_PREPARING;
				},
				updateCallback: function(watch) {
					cell.yellowBoost = Math.abs(Math.sin(50 * watch.now) / 2);
					return false;
				},
				finishCallback: function() {
					cell.yellowBoost = 0;
				}
			});

			var freeze = BC.Animation.make({
				duration: FREEZE_DURATION,
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
				BC.Util.error("clearBlock: pending animations: " + animations.length);
			}

			var fadeOut = BC.Animation.make({
				duration: FADE_OUT_DURATION,
				updateCallback: function(watch) {
					cell.alpha = 1.0 - watch.elapsedPercent;
					return false;
				},
				finishCallback: function() {
					cell.state = CellState.EMPTY_NO_DROP;
					cell.alpha = 1;
				}
			});

			animations.push(fadeOut);
		}

		function sendBlock(duration) {
			var blockStyle = cell.blockStyle;

			cell.blockStyle = 0;
			cell.state = CellState.EMPTY_NO_SWAP;

			if (animations.length > 0) {
				BC.Util.error("sendBlock: pending animations: " + animations.length);
			}

			animations.push(BC.Animation.make({
				duration: duration,
				finishCallback: function() {
					cell.state = CellState.EMPTY;
				}
			}));
			return blockStyle;
		}

		function receiveBlock(duration, direction, blockStyle) {
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
					BC.Util.error("receiveBlock: unsupport direction: " + direction);
					break;
			}
			updateCellMatrix();

			if (animations.length > 0) {
				BC.Util.error("receiveBlock: pending animations: " + animations.length);
			}

			animations.push(BC.Animation.make({
				duration: duration,
				updateCallback: function(watch) {
					var rotationDelta = ROTATION_Y_DELTA * watch.deltaPercent;
					var translationDelta = metrics.ringHeight * watch.deltaPercent;
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
			var needMatrixUpdate = BC.Animation.process(animations, watch);
			if (needMatrixUpdate) {
				updateCellMatrix();
			}
		}

		function updateCellMatrix() {
			var rotationMatrix = BC.Matrix.makeYRotation(rotation[1]);
			var translationMatrix = BC.Matrix.makeTranslation(
					translation[0],
					translation[1],
					translation[2]);
			cell.matrix = BC.Matrix.matrixMultiply(rotationMatrix, translationMatrix);
		}

		return cell;
	};

	return parent;

}(BC || {}))