var BC = (function(parent) {

	var my = parent.Cell = parent.Cell || {}

	my.CellState = {
		EMPTY: 0,
		EMPTY_RESERVED: 1,
		BLOCK: 2,
		RECEIVING_BLOCK: 3,
		CLEARING_BLOCK: 4
	};

	my.make = function(cellIndex, metrics) {
		var CellState = BC.Cell.CellState;
		var Direction = BC.Constants.Direction;

		var blockStyle = BC.Math.randomInt(metrics.numBlockTypes);

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

			// TODO(btmura): private state members that should not be visible
			rotation: rotation,
			translation: translation,
			animations: [],

			clearBlock: clearBlock,
			sendBlock: sendBlock,
			receiveBlock: receiveBlock,

			isEmpty: isEmpty,
			isTransparent: isTransparent,
			update: update
		};

		function isEmpty() {
			return cell.state === CellState.EMPTY || cell.state === CellState.EMPTY_RESERVED;
		}

		function isTransparent() {
			return cell.state === CellState.CLEARING_BLOCK;
		}

		function clearBlock() {
			var flicker = BC.Animation.make({
				duration: 0.5,
				startCallback: function() {
					cell.state = CellState.CLEARING_BLOCK;
				},
				updateCallback: function(watch) {
					cell.yellowBoost = Math.abs(Math.sin(50 * watch.now) / 2);
					return false;
				},
				finishCallback: function() {
					cell.yellowBoost = 0;
				}
			});

			var fadeOut = BC.Animation.make({
				duration: 0.25,
				startCallback: function() {},
				updateCallback: function(watch) {
					cell.alpha = 1.0 - watch.elapsedPercent;
					return false;
				},
				finishCallback: function() {
					cell.state = CellState.EMPTY;
					cell.alpha = 1;
				}
			});

			cell.animations.push(flicker, fadeOut);
		}

		function sendBlock(duration) {
			var blockStyle = cell.blockStyle;
			cell.animations.push(BC.Animation.make({
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
			cell.animations.push(BC.Animation.make({
				duration: duration,
				startCallback: function() {
					cell.state = CellState.RECEIVING_BLOCK;
					cell.blockStyle = blockStyle;

					switch (direction) {
						case Direction.LEFT:
							cell.rotation[1] -= ringRotationY;
							break;

						case Direction.RIGHT:
							cell.rotation[1] += ringRotationY;
							break;

						case Direction.UP:
							cell.translation[1] = metrics.ringHeight;
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
							cell.rotation[1] += rotationDelta;
							return true;

						case Direction.RIGHT:
							cell.rotation[1] -= rotationDelta;
							return true;

						case Direction.UP:
							cell.translation[1] -= translationDelta;
							return true;

						default:
							return false;
					}
					return true;
				},
				finishCallback: function() {
					cell.state = CellState.BLOCK;
				}
			}));
		}

		function update(watch) {
			var needMatrixUpdate = false;

			if (cell.animations.length > 0) {
				var animation = cell.animations[0];
				needMatrixUpdate |= animation.update(watch);
				if (animation.isDone()) {
					cell.animations.shift();
				}
			}

			if (needMatrixUpdate) {
				updateCellMatrix();
			}
		}

		function updateCellMatrix() {
			var rotationMatrix = BC.Matrix.makeYRotation(cell.rotation[1]);
			var translationMatrix = BC.Matrix.makeTranslation(
					cell.translation[0],
					cell.translation[1],
					cell.translation[2]);
			cell.matrix = BC.Matrix.matrixMultiply(rotationMatrix, translationMatrix);
		}

		return cell;
	};

	return parent;

}(BC || {}))