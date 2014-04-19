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

		var maxSwapTime = 0.125;
		var maxDisappearingTime = 0.25;
		var maxDropTime = 0.075;

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
			drop: drop
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

		function drop(downCell) {
			var drop = cell.state === CellState.BLOCK && downCell.state == CellState.EMPTY;
			if (!drop) {
				return;
			}

			downCell.blockStyle = cell.blockStyle;
			downCell.state = CellState.DROP_BLOCK_DST;
			downCell.translation[1] = metrics.ringHeight;
			downCell.elapsedAnimationTime = 0;
			downCell.alpha = 1;

			cell.blockStyle = 0;
			cell.state = CellState.DROP_BLOCK_SRC;
			cell.translation[1] = 0;
			cell.elapsedAnimationTime = 0;
			cell.alpha = 1;
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
			var animation = BC.Animation.make({
				duration: 5,

				startCallback: function() {

				},

				updateCallback: function() {
					cell.yellowBoost = 1.0;
				},

				finishCallback: function() {

				}
			});

			cell.animations.push(animation);
		}

		function update(watch) {
			var needMatrixUpdate = false;

			switch (cell.state) {
				case CellState.DROP_BLOCK_SRC:
				case CellState.DROP_BLOCK_DST:
					needMatrixUpdate |= updateDroppingBlock(watch);
					break;

				case CellState.DISAPPEARING_BLOCK:
					needMatrixUpdate |= updateDisappearingBlock(watch);
					break;

				case CellState.SWAP_LEFT:
				case CellState.SWAP_RIGHT:
				case CellState.SWAP_LEFT_EMPTY:
				case CellState.SWAP_RIGHT_EMPTY:
					needMatrixUpdate |= updateSwappingBlock(watch);
					break;
			}

			for (var i = 0; i < cell.animations.length; i++) {
				cell.animations[i].update(watch);
			}

			if (needMatrixUpdate) {
				updateCellMatrix();
			}
		}

		function updateDroppingBlock(watch) {
			var deltaTime = watch.deltaTime;
			if (cell.elapsedAnimationTime + deltaTime > maxDropTime) {
				deltaTime = maxDropTime - cell.elapsedAnimationTime;
			}

			if (cell.state == CellState.DROP_BLOCK_DST) {
				var translationDelta = metrics.ringHeight * deltaTime / maxDropTime;
				cell.translation[1] -= translationDelta;
			}

			cell.elapsedAnimationTime += deltaTime;
			if (cell.elapsedAnimationTime >= maxDropTime) {
				if (cell.state === CellState.DROP_BLOCK_SRC) {
					cell.state = CellState.EMPTY;
				} else {
					cell.state = CellState.BLOCK;
				}
				cell.elapsedAnimationTime = 0;
			}

			return true;
		}

		function updateDisappearingBlock(watch) {
			var deltaTime = watch.deltaTime;
			if (cell.elapsedDisappearingTime + deltaTime > maxDisappearingTime) {
				deltaTime = maxDisappearingTime - cell.elapsedDisappearingTime;
			}

			cell.elapsedDisappearingTime += deltaTime;
			cell.alpha = 1.0 - cell.elapsedDisappearingTime / maxDisappearingTime;

			if (cell.elapsedDisappearingTime >= maxDisappearingTime) {
				cell.state = CellState.EMPTY;
				cell.elapsedDisappearingTime = 0;
				cell.alpha = 1;
			}

			return false;
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