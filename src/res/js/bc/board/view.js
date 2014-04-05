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

		var selectorTranslation = [0, 0, 0];

		function drawSelector() {
			var scale = 1; // + Math.abs(Math.sin(4 * now)) / 50;
			var scaleMatrix = BC.Matrix.makeScale(scale, scale, 1);
			var translationMatrix = BC.Matrix.makeTranslation(
					selectorTranslation[0],
					selectorTranslation[1],
					selectorTranslation[2]);
			var selectorMatrix = BC.Matrix.matrixMultiply(scaleMatrix, translationMatrix);
			gl.uniformMatrix4fv(matrixLocation, false, selectorMatrix);

			selector.draw(positionLocation, textureCoordLocation);
		}

		var scaleMatrix = BC.Matrix.makeScale(1, 1, 1);

		var rotation = [0, 0, 0];
		var rotationXMatrix = BC.Matrix.makeXRotation(rotation[0]);
		var rotationYMatrix = BC.Matrix.makeYRotation(rotation[1]);
		var rotationZMatrix = BC.Matrix.makeZRotation(rotation[2]);

		var translationMatrix = BC.Matrix.makeTranslation(0, 0, 0);

		var cellRotation = [0, 0, 0];

		function drawRings() {
			var matrix = BC.Matrix.matrixMultiply(scaleMatrix, rotationZMatrix);
			matrix = BC.Matrix.matrixMultiply(matrix, rotationYMatrix);
			matrix = BC.Matrix.matrixMultiply(matrix, rotationXMatrix);
			matrix = BC.Matrix.matrixMultiply(matrix, translationMatrix);

			var rings = model.rings;
			for (var i = 0; i < rings.length; i++) {
				var cells = rings[i].cells;
				for (var j = 0; j < cells.length; j++) {
					var cellRotationYMatrix = BC.Matrix.makeYRotation(cellRotation[1])
					var cellMatrix = BC.Matrix.matrixMultiply(matrix, cellRotationYMatrix);
					gl.uniformMatrix4fv(matrixLocation, false, cellMatrix);
					cell.draw(positionLocation, textureCoordLocation);
					cellRotation[1] += 2 * Math.PI / model.numRingCells;
				}
			}
		}

		function draw() {
			drawRings();
			drawSelector();
		}

		return {
			draw: draw,
		};
	};


	return parent;

}(BC || {}))
