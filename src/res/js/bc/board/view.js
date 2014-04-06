var BC = (function(parent) {

	var my = parent.Board = parent.Board || {}

	/**
	 * Makes a board's view that can draw itself.
	 *
	 * @param model - board model
	 * @returns {Object} board view
	 */
	my.makeView = function(model, gl, programLocations) {
		var matrixLocation = programLocations.matrixLocation;

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
			var selectorMatrix = model.selectorMatrix;
			gl.uniformMatrix4fv(matrixLocation, false, selectorMatrix);
			selector.draw(programLocations);
		}

		function drawRings() {
			var boardMatrix = model.boardMatrix;
			var rings = model.rings;
			for (var i = 0; i < rings.length; i++) {
				var ringMatrix = BC.Matrix.matrixMultiply(boardMatrix, rings[i].matrix);
				var cells = rings[i].cells;
				for (var j = 0; j < cells.length; j++) {
					var cellMatrix = BC.Matrix.matrixMultiply(ringMatrix, cells[j].matrix);
					gl.uniformMatrix4fv(matrixLocation, false, cellMatrix);
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
