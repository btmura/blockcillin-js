var BC = (function(parent) {

	var my = parent.Cell = parent.Cell || {}

	my.CellState = {
		EMPTY: 0,
		EMPTY_RESERVED: 1,
		BLOCK: 2,
		RECEIVING_BLOCK: 3,
		PREPARING_TO_CLEAR_BLOCK: 4,
		READY_TO_CLEAR_BLOCK: 5,
		CLEARING_BLOCK: 6
	};

	my.make = function(cellIndex, metrics) {
		var CellState = BC.Cell.CellState;
		var Direction = BC.Constants.Direction;

		var FLICKER_DURATION = 0.5;
		var FREEZE_DURATION = 0.25;
		var FADE_OUT_DURATION = 0.25;

		var blockStyle = BC.Math.randomInt(metrics.numBlockTypes);
		var animations = [];

		var ringRotationY = BC.Math.sliceRadians(metrics.numCells);
		var rotation = [0, cellIndex * ringRotationY, 0];
		var translation = [0, 0, 0];
		var matrix = BC.Matrix.makeYRotation(rotation[1]);

		var cell = {
			matrix: matrix,
			state: CellState.BLOCK,
			blockStyle: blockStyle,
			yellowBoost: 0,
			alpha: 1,

			markBlock: markBlock,
			clearBlock: clearBlock,
			sendBlock: sendBlock,
			receiveBlock: receiveBlock,

			isEmpty: isEmpty,
			isTransparent: isTransparent,
			update: update
		};

		function markBlock() {
			var flicker = BC.Animation.make({
				duration: FLICKER_DURATION,
				startCallback: function() {
					cell.state = CellState.PREPARING_TO_CLEAR_BLOCK;
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
				updateCallback: function(watch) {
					return false;
				},
				finishCallback: function() {
					cell.state = CellState.READY_TO_CLEAR_BLOCK;
				}
			});

			animations.push(flicker, freeze);
		}

		function clearBlock() {
			console.log("Clearing!");
			var fadeOut = BC.Animation.make({
				duration: FADE_OUT_DURATION,
				startCallback: function() {
					cell.state = CellState.CLEARING_BLOCK;
				},
				updateCallback: function(watch) {
					cell.alpha = 1.0 - watch.elapsedPercent;
					return false;
				},
				finishCallback: function() {
					cell.state = CellState.EMPTY;
					cell.alpha = 1;
				}
			});

			animations.push(fadeOut);
		}

		function sendBlock(duration) {
			var blockStyle = cell.blockStyle;
			animations.push(BC.Animation.make({
				duration: duration,
				startCallback: function() {
					cell.blockStyle = 0;
					cell.state = CellState.EMPTY_RESERVED;
				},
				updateCallback: function(watch) {
					return false;
				},
				finishCallback: function() {
					cell.state = CellState.EMPTY;
				}
			}));
			return blockStyle;
		}

		function receiveBlock(duration, direction, blockStyle) {
			animations.push(BC.Animation.make({
				duration: duration,
				startCallback: function() {
					cell.state = CellState.RECEIVING_BLOCK;
					cell.blockStyle = blockStyle;

					switch (direction) {
						case Direction.LEFT:
							rotation[1] -= ringRotationY;
							break;

						case Direction.RIGHT:
							rotation[1] += ringRotationY;
							break;

						case Direction.UP:
							translation[1] = metrics.ringHeight;
							break;

						default:
							break;
					}
				},
				updateCallback: function(watch) {
					var rotationDelta = ringRotationY * watch.deltaPercent;
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
				}
			}));
		}

		function isEmpty() {
			return cell.state === CellState.EMPTY || cell.state === CellState.EMPTY_RESERVED;
		}

		function isTransparent() {
			return cell.state === CellState.CLEARING_BLOCK;
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