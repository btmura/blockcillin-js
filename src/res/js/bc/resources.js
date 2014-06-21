var BC = (function(root) {

	var me = root.Resources = root.Resources || {};

	me.make = function() {
		var BLOCK = 0;
		var BLOCK_INCOMING = 1;
		var BLOCK_CLEARING = 2;
		var MISC = 4;

		var RED = 0;
		var GREEN = 1;
		var CYAN = 2;
		var MAGENTA = 3;
		var YELLOW = 4;
		var BLUE = 5;

		var tileSet = BC.Common.GL.textureTileSet(8, 8, 0.002);
		var blockTextureTiles = [
			tileSet.tile(BLOCK, RED),
			tileSet.tile(BLOCK, GREEN),
			tileSet.tile(BLOCK, CYAN),
			tileSet.tile(BLOCK, MAGENTA),
			tileSet.tile(BLOCK, YELLOW),
			tileSet.tile(BLOCK, BLUE),

			tileSet.tile(BLOCK_CLEARING, RED),
			tileSet.tile(BLOCK_CLEARING, GREEN),
			tileSet.tile(BLOCK_CLEARING, CYAN),
			tileSet.tile(BLOCK_CLEARING, MAGENTA),
			tileSet.tile(BLOCK_CLEARING, YELLOW),
			tileSet.tile(BLOCK_CLEARING, BLUE),

			tileSet.tile(BLOCK_INCOMING, RED),
			tileSet.tile(BLOCK_INCOMING, GREEN),
			tileSet.tile(BLOCK_INCOMING, CYAN),
			tileSet.tile(BLOCK_INCOMING, MAGENTA),
			tileSet.tile(BLOCK_INCOMING, YELLOW),
			tileSet.tile(BLOCK_INCOMING, BLUE)
		];
		var selectorTextureTile = tileSet.tile(MISC, 0);
		var blackTextureTile = tileSet.tile(MISC, 1);

		return {
			blockTextureTiles: blockTextureTiles,
			selectorTextureTile: selectorTextureTile,
			blackTextureTile: blackTextureTile
		};
	};

	return root;

}(BC || {}))