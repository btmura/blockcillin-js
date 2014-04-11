var BC = (function(parent) {

	var my = parent.Cell = parent.Cell || {}

	my.CellState = {
		EMPTY: 0,
		BLOCK: 1,
		SWAP_LEFT: 2,
		SWAP_RIGHT: 3,
		SWAP_LEFT_EMPTY: 4,
		SWAP_RIGHT_EMPTY: 5,
		DISAPPEARING_BLOCK: 6,
	};

	my.make = function(cellIndex, metrics) {
		var CellState = BC.Cell.CellState;

		var maxSwapTime = 0.125;
		var maxDisappearingTime = 0.25;

		var blockStyle = BC.Math.randomInt(metrics.numBlockTypes);

		var ringRotationY = BC.Math.sliceRadians(metrics.numCells);
		var rotation = [0, cellIndex * ringRotationY, 0];
		var matrix = BC.Matrix.makeYRotation(rotation[1]);

		var cell = {
			matrix: matrix,
			state: CellState.BLOCK,
			blockStyle: blockStyle,
			rotation: rotation,
			alpha: 1,

			isEmpty: isEmpty,
			isTransparent: isTransparent,

			swap: swap,
			update: update,
			clear: clear
		};

		function isEmpty() {
			return cell.state === CellState.EMPTY
					|| cell.state === CellState.SWAP_LEFT_EMPTY
					|| cell.state === CellState.SWAP_RIGHT_EMPTY;
		}

		function isTransparent() {
			return cell.state === CellState.DISAPPEARING_BLOCK;
		}

		function swap(rightCell) {
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
			cell.state = CellState.DISAPPEARING_BLOCK;
			cell.elapsedDisappearingTime = 0;
			cell.alpha = 1;
		}

		function update(watch) {
			switch (cell.state) {
				case CellState.DISAPPEARING_BLOCK:
					updateDisappearingBlock(watch);
					break;

				case CellState.SWAP_LEFT:
				case CellState.SWAP_RIGHT:
				case CellState.SWAP_LEFT_EMPTY:
				case CellState.SWAP_RIGHT_EMPTY:
					updateSwappingBlock(watch);
					break;
			}
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
		}

		return cell;
	};

	return parent;

}(BC || {}))