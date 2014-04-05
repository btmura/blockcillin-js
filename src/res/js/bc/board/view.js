var BC = (function(parent) {

	var my = parent.Board = parent.Board || {}

	/**
	 * Makes a board's view that can draw itself.
	 *
	 * @param model - board model
	 * @returns {Object} board view
	 */
	my.makeView = function(model, gl, positionLocation, matrixLocation, textureCoordLocation) {
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
			var scale = 1; // + Math.abs(Math.sin(4 * now)) / 50;
			var scaleMatrix = BC.Matrix.makeScale(scale, scale, 1);
			var translationMatrix = BC.Matrix.makeTranslation(
					model.selectorTranslation[0],
					model.selectorTranslation[1],
					model.selectorTranslation[2]);
			var selectorMatrix = BC.Matrix.matrixMultiply(scaleMatrix, translationMatrix);
			gl.uniformMatrix4fv(matrixLocation, false, selectorMatrix);

			selector.draw(positionLocation, textureCoordLocation);
		}

		var scaleMatrix = BC.Matrix.makeScale(1, 1, 1);

		var translationMatrix = BC.Matrix.makeTranslation(0, 0, 0);

		var ringTranslation = [0, 0, 0];
		var ringTranslationAmount = model.ringMaxY - model.ringMinY;

		function drawRings() {
			var rotationXMatrix = BC.Matrix.makeXRotation(model.rotation[0]);
			var rotationYMatrix = BC.Matrix.makeYRotation(model.rotation[1]);
			var rotationZMatrix = BC.Matrix.makeZRotation(model.rotation[2]);

			var matrix = BC.Matrix.matrixMultiply(scaleMatrix, rotationZMatrix);
			matrix = BC.Matrix.matrixMultiply(matrix, rotationYMatrix);
			matrix = BC.Matrix.matrixMultiply(matrix, rotationXMatrix);
			matrix = BC.Matrix.matrixMultiply(matrix, translationMatrix);

			var rings = model.rings;
			for (var i = 0; i < rings.length; i++) {
				ringTranslation[1] = -i * ringTranslationAmount;
				var relativeRingMatrix = BC.Matrix.makeTranslation(
						ringTranslation[0],
						ringTranslation[1],
						ringTranslation[2]);

				var cells = rings[i].cells;
				for (var j = 0; j < cells.length; j++) {
					var cellMatrix = BC.Matrix.matrixMultiply(matrix, relativeRingMatrix);
					cellMatrix = BC.Matrix.matrixMultiply(cellMatrix, cells[j].matrix);

					gl.uniformMatrix4fv(matrixLocation, false, cellMatrix);
					cell.draw(cells[j], positionLocation, textureCoordLocation);
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
