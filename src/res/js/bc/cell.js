var BC = (function(parent) {

	var my = parent.Cell = parent.Cell || {}

	my.CellState = {
		EMPTY: 0,
		BLOCK: 1,
		SWAP_LEFT: 2,
		SWAP_RIGHT: 3,
		DISAPPEARING_BLOCK: 4
	};

	my.make = function(cellIndex, metrics) {
		var CellState = BC.Cell.CellState;

		var maxSwapTime = 0.125;
		var maxDisappearingTime = 4;

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

			swap: swap,
			update: update,
			clear: clear
		};

		function swap(otherCell) {
			if (cell.state !== CellState.BLOCK || otherCell.state !== CellState.BLOCK) {
				return false;
			}

			var prevBlockStyle = cell.blockStyle;

			cell.blockStyle = otherCell.blockStyle;
			cell.state = CellState.SWAP_RIGHT;
			cell.rotation[1] += ringRotationY;
			cell.elapsedSwapTime = 0;

			otherCell.blockStyle = prevBlockStyle;
			otherCell.state = CellState.SWAP_LEFT;
			otherCell.rotation[1] -= ringRotationY;
			otherCell.elapsedSwapTime = 0;

			return true;
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
			if (cell.state == CellState.SWAP_LEFT) {
				cell.rotation[1] += rotationDelta;
			} else {
				cell.rotation[1] -= rotationDelta;
			}
			cell.matrix = BC.Matrix.makeYRotation(cell.rotation[1]);

			cell.elapsedSwapTime += time;
			if (cell.elapsedSwapTime >= maxSwapTime) {
				cell.state = CellState.BLOCK;
				cell.elapsedSwapTime = 0;
			}
		}

		return cell;
	};

	return parent;

}(BC || {}))