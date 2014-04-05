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
		var selector = BC.Selector.makeSelector(gl, model, selectorTextureTile);

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

		function draw() {
			drawSelector();
		}

		return {
			draw: draw,
		};
	};


	return parent;

}(BC || {}))
