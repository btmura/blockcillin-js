var BC = (function(parent) {

	var my = parent.BoardView = parent.BoardView || {}

	my.make = function(board, gl, programLocations) {
		var boardMatrixLocation = programLocations.boardMatrixLocation;
		var ringMatrixLocation = programLocations.ringMatrixLocation;
		var cellMatrixLocation = programLocations.cellMatrixLocation;

		var tileSet = BC.GL.textureTileSet(4, 4, 0.002);
		var blockTextureTiles = [
			tileSet.tile(0, 0),
			tileSet.tile(0, 1),
			tileSet.tile(0, 2),
			tileSet.tile(0, 3),
			tileSet.tile(1, 0),
			tileSet.tile(1, 1)
		];
		var selectorTextureTile = tileSet.tile(1, 2);

		var cellView = BC.CellView.make(gl, board, blockTextureTiles);
		var selectorView = BC.SelectorView.make(gl, board, selectorTextureTile);

		function draw() {
			drawRings();
			drawSelector();
		}

		function drawRings() {
			gl.uniformMatrix4fv(boardMatrixLocation, false, board.matrix);
			var rings = board.rings;
			for (var i = 0; i < rings.length; i++) {
				gl.uniformMatrix4fv(ringMatrixLocation, false, rings[i].matrix);
				var cells = rings[i].cells;
				for (var j = 0; j < cells.length; j++) {
					gl.uniformMatrix4fv(cellMatrixLocation, false, cells[j].matrix);
					cellView.draw(cells[j], programLocations);
				}
			}
		}

		function drawSelector() {
			gl.uniformMatrix4fv(boardMatrixLocation, false, board.selectorMatrix);
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
