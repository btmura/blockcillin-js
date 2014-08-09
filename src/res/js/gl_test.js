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

module("BC.GL");

test("textureTileSet", function() {
	var inset = 0;
	var tileSet = BC.GL.textureTileSet(1, 1, inset);
	QUnit.assert.tile(tileSet, 0, 0, [0, 0], [1, 0], [1, 1], [0, 1], inset);
});

test("textureTileSet_inset", function() {
	var inset = 0.1;
	var tileSet = BC.GL.textureTileSet(1, 1, inset);
	QUnit.assert.tile(tileSet, 0, 0, [0, 0], [1, 0], [1, 1], [0, 1], inset);
});

test("textureTileSet_multipleTiles", function() {
	var inset = 0;
	var tileSet = BC.GL.textureTileSet(2, 2, inset);
	QUnit.assert.tile(tileSet, 0, 0, [0, 0], [0.5, 0], [0.5, 0.5], [0, 0.5], inset);
	QUnit.assert.tile(tileSet, 0, 1, [0.5, 0], [1, 0], [1, 0.5], [0.5, 0.5], inset);
});

test("textureTileSet_multipleTiles_inset", function() {
	var inset = 0.2;
	var tileSet = BC.GL.textureTileSet(2, 2, inset);
	QUnit.assert.tile(tileSet, 0, 0, [0, 0], [0.5, 0], [0.5, 0.5], [0, 0.5], inset);
	QUnit.assert.tile(tileSet, 0, 1, [0.5, 0], [1, 0], [1, 0.5], [0.5, 0.5], inset);
});

QUnit.extend(QUnit.assert, {
	tile: function(tileSet, tileX, tileY, topLeft, topRight, bottomRight, bottomLeft, inset) {
		var close = QUnit.assert.close;
		var maxErr = 0.0001;

		var addInset = function(textureCoords, sInset, tInset) {
			return [textureCoords[0] + sInset, textureCoords[1] + tInset];
		};

		var	message = function(tileX, tileY, s, t, inset) {
			return "tile: (" + tileX + ", " + tileY +
				") coord: (" + s + ", " + t +
				") inset: " + inset;
		};

		var tile = tileSet.tile(tileX, tileY);

		close(tile.textureCoord(0, 0), addInset(topLeft, inset, inset), maxErr,
			message(tileX, tileY, 0, 0, inset));

		close(tile.textureCoord(1, 0), addInset(topRight, -inset, inset), maxErr,
			message(tileX, tileY, 1, 0, inset));

		close(tile.textureCoord(1, 1), addInset(bottomRight, -inset, -inset), maxErr,
			message(tileX, tileY, 1, 1, inset));

		close(tile.textureCoord(0, 1), addInset(bottomLeft, inset, -inset), maxErr,
			message(tileX, tileY, 0, 1, inset));
	}
});
