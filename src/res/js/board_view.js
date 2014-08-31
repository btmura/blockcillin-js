/*
 * Copyright (C) 2014  Brian Muramatsu
 *
 * This file is part of blockcillin.
 *
 * blockcillin is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * blockcillin is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with blockcillin.  If not, see <http://www.gnu.org/licenses/>.
 */

var BC = (function(root) {

	var parent = root.Board = root.Board || {};
	var me = parent.View = parent.View || {};

	me.make = function(args) {
		var board = args.board;
		var gl = args.gl;
		var programLocations = args.programLocations;
		var resources = args.resources;
		var speedLevelView = args.speedLevelStatView;
		var elapsedTimeView = args.elapsedTimeStatView;
		var scoreView = args.scoreStatView;

		var boardRotationMatrixLocation = programLocations.boardRotationMatrixLocation;
		var boardTranslationMatrixLocation = programLocations.boardTranslationMatrixLocation;
		var selectorMatrixLocation = programLocations.selectorMatrixLocation;
		var ringMatrixLocation = programLocations.ringMatrixLocation;
		var cellMatrixLocation = programLocations.cellMatrixLocation;

		var cellView = BC.Cell.View.make(gl, board.metrics, resources.blockTextureTiles);
		var selectorView = BC.Selector.View.make({
			gl: gl,
			metrics: board.metrics,
			programLocations: programLocations,
			textureTile: resources.selectorTextureTile
		});
		var stageView = BC.Stage.View.make(gl, board.metrics, resources.blackTextureTile);

		function draw(lagFactor) {
			var boardDrawSpec = board.getDrawSpec(lagFactor);
			var selectorDrawSpec = board.selector.getDrawSpec(lagFactor);

			drawStats();

			drawRings(boardDrawSpec, selectorDrawSpec, lagFactor);
			drawStage();

			// Draw selector last for alpha values.
			drawSelector(boardDrawSpec, selectorDrawSpec);
		}

		function drawStats() {
			// TODO(btmura): consider reusing one view for all stats
			speedLevelView.draw(board.speedLevel);
			elapsedTimeView.draw(board.elapsedTime);
			scoreView.draw(board.score);
		}

		function drawRings(boardDrawSpec, selectorDrawSpec, lagFactor) {
			gl.uniformMatrix4fv(boardRotationMatrixLocation, false, selectorDrawSpec.boardRotationMatrix);
			gl.uniformMatrix4fv(boardTranslationMatrixLocation, false, boardDrawSpec.translationMatrix);
			gl.uniformMatrix4fv(selectorMatrixLocation, false, BC.Math.Matrix.identity);
			var rings = board.rings;
			for (var i = 0; i < 2; i++) {
				for (var j = 0; j < rings.length; j++) {
					gl.uniformMatrix4fv(ringMatrixLocation, false, rings[j].matrix);
					var cells = rings[j].cells;
					for (var k = 0; k < cells.length; k++) {
						var cellDrawSpec = cells[k].getDrawSpec(lagFactor);
						gl.uniformMatrix4fv(cellMatrixLocation, false, cellDrawSpec.matrix);
						if (i == 0) {
							cellView.drawOpaque(cellDrawSpec, programLocations);
						} else {
							cellView.drawTransparent(cellDrawSpec, programLocations);
						}
					}
				}
			}
		}

		function drawSelector(boardDrawSpec, selectorDrawSpec) {
			// Don't rotate the board since the selector stays centered.
			gl.uniformMatrix4fv(boardRotationMatrixLocation, false, BC.Math.Matrix.identity);

			// Translate the selector vertically to match the board position.
			gl.uniformMatrix4fv(boardTranslationMatrixLocation, false, boardDrawSpec.translationMatrix);

			gl.uniformMatrix4fv(selectorMatrixLocation, false, selectorDrawSpec.matrix);
			gl.uniformMatrix4fv(ringMatrixLocation, false, BC.Math.Matrix.identity);
			gl.uniformMatrix4fv(cellMatrixLocation, false, BC.Math.Matrix.identity);
			selectorView.draw();
		}

		function drawStage() {
			gl.uniformMatrix4fv(boardRotationMatrixLocation, false, BC.Math.Matrix.identity);
			gl.uniformMatrix4fv(boardTranslationMatrixLocation, false, BC.Math.Matrix.identity);
			gl.uniformMatrix4fv(selectorMatrixLocation, false, board.stage.matrix);
			gl.uniformMatrix4fv(ringMatrixLocation, false, BC.Math.Matrix.identity);
			gl.uniformMatrix4fv(cellMatrixLocation, false, BC.Math.Matrix.identity);
			stageView.draw(programLocations);
		}

		return {
			draw: draw
		};
	};


	return root;

}(BC || {}))
