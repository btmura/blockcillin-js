module("BC.GL");

test("textureTileSet_1x1", function() {
	var ts = BC.GL.textureTileSet(1, 1);
	var t = ts.tile(0, 0);
	deepEqual(t.textureCoord(0, 0), [0, 0], "tile: (0, 0) coord: (0, 0)");
	deepEqual(t.textureCoord(1, 0), [1, 0], "tile: (0, 0) coord: (1, 0)");
	deepEqual(t.textureCoord(1, 1), [1, 1], "tile: (0, 0) coord: (1, 1)");
	deepEqual(t.textureCoord(0, 1), [0, 1], "tile: (0, 0) coord: (0, 1)");
});

test("textureTileSet_2x2", function() {
	var ts = BC.GL.textureTileSet(2, 2);
	var t = ts.tile(0, 0);
	deepEqual(t.textureCoord(0, 0), [0, 0], "tile: (0, 0) coord: (0, 0)");
	deepEqual(t.textureCoord(1, 0), [0.5, 0], "tile: (0, 0) coord: (1, 0)");
	deepEqual(t.textureCoord(1, 1), [0.5, 0.5], "tile: (0, 0) coord: (1, 1)");
	deepEqual(t.textureCoord(0, 1), [0, 0.5], "tile: (0, 0) coord: (0, 1)");

	var t = ts.tile(0, 1);
	deepEqual(t.textureCoord(0, 0), [0.5, 0], "tile: (0, 1) coord: (0, 0)");
	deepEqual(t.textureCoord(1, 0), [1, 0], "tile: (0, 1) coord: (1, 0)");
	deepEqual(t.textureCoord(1, 1), [1, 0.5], "tile: (0, 1) coord: (1, 1)");
	deepEqual(t.textureCoord(0, 1), [0.5, 0.5], "tile: (0, 1) coord: (0, 1)");
});
