var BC = (function(parent) {

	var my = parent.BoardView = parent.BoardView || {}

	/**
	 * Makes a board's view that can draw itself.
	 *
	 * @param model - board model
	 * @returns {Object} board view
	 */
	my.make = function(model, gl, programLocations) {
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

		var cell = BC.Cell.make(gl, model, blockTextureTiles);
		var selector = BC.Selector.make(gl, model, selectorTextureTile);

		function drawSelector() {
			gl.uniformMatrix4fv(boardMatrixLocation, false, model.selectorMatrix);
			gl.uniformMatrix4fv(ringMatrixLocation, false, BC.Matrix.identity);
			gl.uniformMatrix4fv(cellMatrixLocation, false, BC.Matrix.identity);
			selector.draw(programLocations);
		}

		function drawRings() {
			gl.uniformMatrix4fv(boardMatrixLocation, false, model.boardMatrix);
			var rings = model.rings;
			for (var i = 0; i < rings.length; i++) {
				gl.uniformMatrix4fv(ringMatrixLocation, false, rings[i].matrix);
				var cells = rings[i].cells;
				for (var j = 0; j < cells.length; j++) {
					gl.uniformMatrix4fv(cellMatrixLocation, false, cells[j].matrix);
					cell.draw(cells[j], programLocations);
				}
			}
		}

		function draw() {
			drawRings();
			drawSelector();
		}

		return {
			draw: draw
		};
	};


	return parent;

}(BC || {}))
