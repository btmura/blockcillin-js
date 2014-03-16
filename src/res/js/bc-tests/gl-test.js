module("BC.GL");

test("textureTileSet", function() {
	var ts = BC.GL.textureTileSet(1, 1, 0);
	var t = ts.tile(0, 0);
	deepEqual(t.textureCoord(0, 0), [0, 0], "tile: (0, 0) coord: (0, 0) inset: 0");
	deepEqual(t.textureCoord(1, 0), [1, 0], "tile: (0, 0) coord: (1, 0) inset: 0");
	deepEqual(t.textureCoord(1, 1), [1, 1], "tile: (0, 0) coord: (1, 1) inset: 0");
	deepEqual(t.textureCoord(0, 1), [0, 1], "tile: (0, 0) coord: (0, 1) inset: 0");
});

test("textureTileSet_inset", function() {
	var inset = 0.1;
	var ts = BC.GL.textureTileSet(1, 1, inset);
	var t = ts.tile(0, 0);
	deepEqual(t.textureCoord(0, 0), [0 + inset, 0 + inset], "tile: (0, 0) coord: (0, 0) inset: 0.1");
	deepEqual(t.textureCoord(1, 0), [1 - inset, 0 + inset], "tile: (0, 0) coord: (1, 0) inset: 0.1");
	deepEqual(t.textureCoord(1, 1), [1 - inset, 1 - inset], "tile: (0, 0) coord: (1, 1) inset: 0.1");
	deepEqual(t.textureCoord(0, 1), [0 + inset, 1 - inset], "tile: (0, 0) coord: (0, 1) inset: 0.1");
});

test("textureTileSet_multipleTiles", function() {
	var ts = BC.GL.textureTileSet(2, 2, 0);
	var t = ts.tile(0, 0);
	deepEqual(t.textureCoord(0, 0), [0, 0], "tile: (0, 0) coord: (0, 0) inset: 0");
	deepEqual(t.textureCoord(1, 0), [0.5, 0], "tile: (0, 0) coord: (1, 0) inset: 0");
	deepEqual(t.textureCoord(1, 1), [0.5, 0.5], "tile: (0, 0) coord: (1, 1) inset: 0");
	deepEqual(t.textureCoord(0, 1), [0, 0.5], "tile: (0, 0) coord: (0, 1) inset: 0");

	var t = ts.tile(0, 1);
	deepEqual(t.textureCoord(0, 0), [0.5, 0], "tile: (0, 1) coord: (0, 0) inset: 0");
	deepEqual(t.textureCoord(1, 0), [1, 0], "tile: (0, 1) coord: (1, 0) inset: 0");
	deepEqual(t.textureCoord(1, 1), [1, 0.5], "tile: (0, 1) coord: (1, 1) inset: 0");
	deepEqual(t.textureCoord(0, 1), [0.5, 0.5], "tile: (0, 1) coord: (0, 1) inset: 0");
});

test("textureTileSet_multipleTiles", function() {
	var close = QUnit.assert.close;
	var maxErr = 0.0001;

	var inset = 0.2;
	var ts = BC.GL.textureTileSet(2, 2, inset);
	var t = ts.tile(0, 0);
	close(t.textureCoord(0, 0), [0 + inset, 0 + inset], maxErr, "tile: (0, 0) coord: (0, 0) inset: 0.2");
	close(t.textureCoord(1, 0), [0.5 - inset, 0 + inset], maxErr, "tile: (0, 0) coord: (1, 0) inset: 0.2");
	close(t.textureCoord(1, 1), [0.5 - inset, 0.5 - inset], maxErr, "tile: (0, 0) coord: (1, 1) inset: 0.2");
	close(t.textureCoord(0, 1), [0 + inset, 0.5 - inset], maxErr, "tile: (0, 0) coord: (0, 1) inset: 0.2");

	var t = ts.tile(0, 1);
	close(t.textureCoord(0, 0), [0.5 + inset, 0 + inset], maxErr, "tile: (0, 1) coord: (0, 0) inset: 0.2");
	close(t.textureCoord(1, 0), [1 - inset, 0 + inset], maxErr, "tile: (0, 1) coord: (1, 0) inset: 0.2");
	close(t.textureCoord(1, 1), [1 - inset, 0.5 - inset], maxErr, "tile: (0, 1) coord: (1, 1) inset: 0.2");
	close(t.textureCoord(0, 1), [0.5 + inset, 0.5 - inset], maxErr, "tile: (0, 1) coord: (0, 1) inset: 0.2");
});
