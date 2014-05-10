var BC = (function(parent) {

	var module = parent.Board = parent.Board || {}
	var my = module.View = module.View || {}

	my.make = function(board, gl, programLocations) {
		var boardRotationMatrixLocation = programLocations.boardRotationMatrixLocation;
		var boardTranslationMatrixLocation = programLocations.boardTranslationMatrixLocation;
		var selectorMatrixLocation = programLocations.selectorMatrixLocation;
		var ringMatrixLocation = programLocations.ringMatrixLocation;
		var cellMatrixLocation = programLocations.cellMatrixLocation;

		var tileSet = BC.GL.textureTileSet(8, 8, 0.002);
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
		var blackTextureTile = tileSet.tile(1, 3);

		var cellView = BC.Cell.View.make(gl, board.metrics, blockTextureTiles);
		var selectorView = BC.Selector.View.make(gl, board.metrics, selectorTextureTile);
		var stageView = BC.Stage.View.make(gl, board.metrics, blackTextureTile);

		function draw() {
			drawRings();
			drawStage();

			// Draw selector last for alpha values.
			drawSelector();
		}

		function drawRings() {
			gl.uniformMatrix4fv(boardRotationMatrixLocation, false, board.rotationMatrix);
			gl.uniformMatrix4fv(boardTranslationMatrixLocation, false, board.translationMatrix);
			gl.uniformMatrix4fv(selectorMatrixLocation, false, BC.Matrix.identity);
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
			// Don't rotate the board since the selector stays centered.
			gl.uniformMatrix4fv(boardRotationMatrixLocation, false, BC.Matrix.identity);
			gl.uniformMatrix4fv(boardTranslationMatrixLocation, false, board.translationMatrix);
			gl.uniformMatrix4fv(selectorMatrixLocation, false, board.selector.matrix);
			gl.uniformMatrix4fv(ringMatrixLocation, false, BC.Matrix.identity);
			gl.uniformMatrix4fv(cellMatrixLocation, false, BC.Matrix.identity);
			selectorView.draw(programLocations);
		}

		function drawStage() {
			gl.uniformMatrix4fv(boardRotationMatrixLocation, false, BC.Matrix.identity);
			gl.uniformMatrix4fv(boardTranslationMatrixLocation, false, BC.Matrix.identity);
			gl.uniformMatrix4fv(selectorMatrixLocation, false, board.stage.matrix);
			gl.uniformMatrix4fv(ringMatrixLocation, false, BC.Matrix.identity);
			gl.uniformMatrix4fv(cellMatrixLocation, false, BC.Matrix.identity);
			stageView.draw(programLocations);
		}

		return {
			draw: draw
		};
	};


	return parent;

}(BC || {}))
