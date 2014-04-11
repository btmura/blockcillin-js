var BC = (function(parent) {

	var my = parent.Cell = parent.Cell || {}

	my.CellState = {
		NONE: 0,
		BLOCK: 1,
		SWAP_LEFT: 2,
		SWAP_RIGHT: 3
	};

	my.make = function(cellIndex, metrics) {
		var CellState = BC.Cell.CellState;

		var maxCellSwapTime = 0.125;

		var blockStyle = BC.Math.randomInt(metrics.numBlockTypes);

		var ringRotationY = BC.Math.sliceRadians(metrics.numCells);
		var rotation = [0, cellIndex * ringRotationY, 0];
		var matrix = BC.Matrix.makeYRotation(rotation[1]);

		var state = BC.Math.randomInt(2);

		var cell = {
			matrix: matrix,
			state: state,
			blockStyle: blockStyle,
			rotation: rotation,

			swap: swap,
			update: update
		};

		function swap(otherCell) {
			var prevBlockStyle = cell.blockStyle;

			cell.blockStyle = otherCell.blockStyle;
			cell.state = CellState.SWAP_RIGHT;
			cell.rotation[1] += ringRotationY;
			cell.elapsedSwapTime = 0;

			otherCell.blockStyle = prevBlockStyle;
			otherCell.state = CellState.SWAP_LEFT;
			otherCell.rotation[1] -= ringRotationY;
			otherCell.elapsedSwapTime = 0;
		}

		function update(watch) {
			if (cell.state == CellState.SWAP_LEFT || cell.state == CellState.SWAP_RIGHT) {
				var time = watch.deltaTime;
				if (cell.elapsedSwapTime + time > maxCellSwapTime) {
					time = maxCellSwapTime - cell.elapsedSwapTime;
				}

				var rotationDelta = ringRotationY * time / maxCellSwapTime;
				if (cell.state == CellState.SWAP_LEFT) {
					cell.rotation[1] += rotationDelta;
				} else {
					cell.rotation[1] -= rotationDelta;
				}
				cell.matrix = BC.Matrix.makeYRotation(cell.rotation[1]);

				cell.elapsedSwapTime += time;
				if (cell.elapsedSwapTime >= maxCellSwapTime) {
					cell.state = CellState.NONE;
					cell.elapsedSwapTime = 0;
				}
			}
		}

		return cell;
	};

	return parent;

}(BC || {}))