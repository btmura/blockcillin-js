var BC = (function(parent) {

	var my = parent.Cell = parent.Cell || {}

	my.CellState = {
		EMPTY: 0,
		BLOCK: 1,
		SWAP_LEFT: 2,
		SWAP_RIGHT: 3,
		SWAP_LEFT_EMPTY: 4,
		SWAP_RIGHT_EMPTY: 5,
		DROP_BLOCK_SRC: 6,
		DROP_BLOCK_DST: 7,
		DISAPPEARING_BLOCK: 8
	};

	my.make = function(cellIndex, metrics) {
		var CellState = BC.Cell.CellState;

		var DROP_DURATION = 0.075;
		var maxSwapTime = 0.125;

		var blockStyle = BC.Math.randomInt(metrics.numBlockTypes);

		var ringRotationY = BC.Math.sliceRadians(metrics.numCells);
		var rotation = [0, cellIndex * ringRotationY, 0];
		var translation = [0, 0, 0];
		var matrix = BC.Matrix.makeYRotation(rotation[1]);

		var cell = {
			matrix: matrix,
			state: CellState.BLOCK,
			blockStyle: blockStyle,
			rotation: rotation,
			translation: translation,
			alpha: 1,
			yellowBoost: 0,

			isEmpty: isEmpty,
			isTransparent: isTransparent,

			animations: [],

			swap: swap,
			update: update,
			clear: clear,

			sendBlock: sendBlock,
			receiveBlock: receiveBlock
		};

		function isEmpty() {
			return cell.state === CellState.EMPTY
					|| cell.state === CellState.SWAP_LEFT_EMPTY
					|| cell.state === CellState.SWAP_RIGHT_EMPTY
					|| cell.state === CellState.DROP_BLOCK_SRC;
		}

		function isTransparent() {
			return cell.state === CellState.DISAPPEARING_BLOCK;
		}

		function sendBlock() {
			var blockStyle = cell.blockStyle;

			cell.animations.push(BC.Animation.make({
				duration: DROP_DURATION,
				startCallback: function() {
					cell.blockStyle = 0;
					cell.state = CellState.DROP_BLOCK_SRC;
					cell.translation[1] = 0;
					cell.alpha = 1;
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

		function receiveBlock(blockStyle) {
			cell.animations.push(BC.Animation.make({
				duration: DROP_DURATION,
				startCallback: function() {
					cell.blockStyle = blockStyle;
					cell.state = CellState.DROP_BLOCK_DST;
					cell.translation[1] = metrics.ringHeight;
					cell.alpha = 1;
				},
				updateCallback: function(watch) {
					var translationDelta = metrics.ringHeight * watch.deltaPercent;
					cell.translation[1] -= translationDelta;
					return true;
				},
				finishCallback: function() {
					cell.state = CellState.BLOCK;
				}
			}));
		}

		function swap(rightCell) {
			console.log("left: " + cell.state + " right: " + rightCell.state);

			var moveLeft = cell.state === CellState.EMPTY && rightCell.state === CellState.BLOCK;
			var moveRight = cell.state === CellState.BLOCK && rightCell.state === CellState.EMPTY;
			var swap = cell.state === CellState.BLOCK && rightCell.state === CellState.BLOCK;
			if (!moveLeft && !moveRight && !swap) {
				return false;
			}

			var prevBlockStyle = cell.blockStyle;

			function swapCells(leftState, rightState) {
				cell.blockStyle = rightCell.blockStyle;
				cell.state = leftState;
				cell.rotation[1] += ringRotationY;
				cell.elapsedSwapTime = 0;

				rightCell.blockStyle = prevBlockStyle;
				rightCell.state = rightState;
				rightCell.rotation[1] -= ringRotationY;
				rightCell.elapsedSwapTime = 0;
			}

			if (moveLeft) {
				swapCells(CellState.SWAP_RIGHT, CellState.SWAP_LEFT_EMPTY);
				return true;
			}

			if (moveRight) {
				swapCells(CellState.SWAP_RIGHT_EMPTY, CellState.SWAP_LEFT);
				return true;
			}

			if (swap) {
				swapCells(CellState.SWAP_RIGHT, CellState.SWAP_LEFT);
				return true;
			}

			return false;
		}

		function clear() {
			var flicker = BC.Animation.make({
				duration: 0.5,
				startCallback: function() {
					cell.state = CellState.DISAPPEARING_BLOCK;
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
				startCallback: function() {
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

			cell.animations.push(flicker, fadeOut);
		}

		function update(watch) {
			var needMatrixUpdate = false;

			switch (cell.state) {
				case CellState.SWAP_LEFT:
				case CellState.SWAP_RIGHT:
				case CellState.SWAP_LEFT_EMPTY:
				case CellState.SWAP_RIGHT_EMPTY:
					needMatrixUpdate |= updateSwappingBlock(watch);
					break;
			}

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

		function updateSwappingBlock(watch) {
			var time = watch.deltaTime;
			if (cell.elapsedSwapTime + time > maxSwapTime) {
				time = maxSwapTime - cell.elapsedSwapTime;
			}

			var rotationDelta = ringRotationY * time / maxSwapTime;
			if (cell.state === CellState.SWAP_LEFT || cell.state === CellState.SWAP_LEFT_EMPTY) {
				cell.rotation[1] += rotationDelta;
			} else {
				cell.rotation[1] -= rotationDelta;
			}
			cell.matrix = BC.Matrix.makeYRotation(cell.rotation[1]);

			cell.elapsedSwapTime += time;
			if (cell.elapsedSwapTime >= maxSwapTime) {
				cell.state = cell.isEmpty() ? CellState.EMPTY : CellState.BLOCK;
				cell.elapsedSwapTime = 0;
			}

			return true;
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