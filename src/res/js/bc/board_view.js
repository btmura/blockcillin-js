var BC = (function(root) {

	var parent = root.Board = root.Board || {};
	var me = parent.View = parent.View || {};

	me.make = function(args) {
		var board = args.board;
		var gl = args.gl;
		var programLocations = args.programLocations;
		var resources = args.resources;

		var boardRotationMatrixLocation = programLocations.boardRotationMatrixLocation;
		var boardTranslationMatrixLocation = programLocations.boardTranslationMatrixLocation;
		var selectorMatrixLocation = programLocations.selectorMatrixLocation;
		var ringMatrixLocation = programLocations.ringMatrixLocation;
		var cellMatrixLocation = programLocations.cellMatrixLocation;

		var cellView = BC.Cell.View.make(gl, board.metrics, resources.blockTextureTiles);
		var selectorView = BC.Selector.View.make(gl, board.metrics, resources.selectorTextureTile);
		var stageView = BC.Stage.View.make(gl, board.metrics, resources.blackTextureTile);

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


	return root;

}(BC || {}))
