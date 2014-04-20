var BC = (function(parent) {

	var my = parent.BoardView = parent.BoardView || {}

	my.make = function(board, gl, programLocations) {
		var boardMatrixLocation = programLocations.boardMatrixLocation;
		var ringMatrixLocation = programLocations.ringMatrixLocation;
		var cellMatrixLocation = programLocations.cellMatrixLocation;

		var tileSet = BC.GL.textureTileSet(4, 4, 0.002);
		var blockTextureTiles = [
			tileSet.tile(0, 0), // red
			tileSet.tile(0, 1), // green
			tileSet.tile(0, 2), // cyan
			tileSet.tile(0, 3), // magenta
			tileSet.tile(1, 0), // yellow
			tileSet.tile(1, 1), // blue

			tileSet.tile(2, 0), // red
			tileSet.tile(2, 1), // green
			tileSet.tile(2, 2), // cyan
			tileSet.tile(2, 3), // magenta
			tileSet.tile(3, 0), // yellow
			tileSet.tile(3, 1)  // blue
		];
		var selectorTextureTile = tileSet.tile(1, 2);

		var cellView = BC.CellView.make(gl, board.metrics, blockTextureTiles);
		var selectorView = BC.SelectorView.make(gl, board.metrics, selectorTextureTile);

		function draw() {
			drawRings();
			drawSelector();
		}

		function drawRings() {
			gl.uniformMatrix4fv(boardMatrixLocation, false, board.matrix);
			var rings = board.rings;
			for (var i = 0; i < 2; i++) {
				for (var j = 0; j < rings.length; j++) {
					gl.uniformMatrix4fv(ringMatrixLocation, false, rings[j].matrix);
					var cells = rings[j].cells;
					for (var k = 0; k < cells.length; k++) {
						gl.uniformMatrix4fv(cellMatrixLocation, false, cells[k].matrix);
						if (i == 0) {
							cellView.drawOpaque(cells[k], programLocations);
						} else {
							cellView.drawTransparent(cells[k], programLocations);
						}
					}
				}
			}
		}

		function drawSelector() {
			gl.uniformMatrix4fv(boardMatrixLocation, false, board.selector.matrix);
			gl.uniformMatrix4fv(ringMatrixLocation, false, BC.Matrix.identity);
			gl.uniformMatrix4fv(cellMatrixLocation, false, BC.Matrix.identity);
			selectorView.draw(programLocations);
		}

		return {
			draw: draw
		};
	};


	return parent;

}(BC || {}))
