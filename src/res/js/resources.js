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

	// TODO(btmura): rename module to Texture
	var me = root.Resources = root.Resources || {};

	me.Id = {
		BLOCK_RED: 0,
		BLOCK_GREEN: 1,
		BLOCK_CYAN: 2,
		BLOCK_MAGENTA: 3,
		BLOCK_YELLOW: 4,
		BLOCK_BLUE: 5,

		BLOCK_INCOMING_RED: 10,
		BLOCK_INCOMING_GREEN: 11,
		BLOCK_INCOMING_CYAN: 12,
		BLOCK_INCOMING_MAGENTA: 13,
		BLOCK_INCOMING_YELLOW: 14,
		BLOCK_INCOMING_BLUE: 15,

		BLOCK_MARKED_RED: 20,
		BLOCK_MARKED_GREEN: 21,
		BLOCK_MARKED_CYAN: 22,
		BLOCK_MARKED_MAGENTA: 23,
		BLOCK_MARKED_YELLOW: 24,
		BLOCK_MARKED_BLUE: 25,

		SELECTOR: 30,
		STAGE: 31,
		EXPLOSION: 32
	}

	me.make = function() {
		var Id = BC.Resources.Id;

		var tileSet = BC.GL.textureTileSet(8, 8, 0.002);
		var textureTiles = {};

		textureTiles[Id.BLOCK_RED]  = tileSet.tile(0, 0);
		textureTiles[Id.BLOCK_GREEN]  = tileSet.tile(0, 1);
		textureTiles[Id.BLOCK_CYAN]  = tileSet.tile(0, 2);
		textureTiles[Id.BLOCK_MAGENTA]  = tileSet.tile(0, 3);
		textureTiles[Id.BLOCK_YELLOW]  = tileSet.tile(0, 4);
		textureTiles[Id.BLOCK_BLUE]  = tileSet.tile(0, 5);

		textureTiles[Id.BLOCK_INCOMING_RED]  = tileSet.tile(1, 0);
		textureTiles[Id.BLOCK_INCOMING_GREEN]  = tileSet.tile(1, 1);
		textureTiles[Id.BLOCK_INCOMING_CYAN]  = tileSet.tile(1, 2);
		textureTiles[Id.BLOCK_INCOMING_MAGENTA]  = tileSet.tile(1, 3);
		textureTiles[Id.BLOCK_INCOMING_YELLOW]  = tileSet.tile(1, 4);
		textureTiles[Id.BLOCK_INCOMING_BLUE]  = tileSet.tile(1, 5);

		textureTiles[Id.BLOCK_MARKED_RED]  = tileSet.tile(2, 0);
		textureTiles[Id.BLOCK_MARKED_GREEN]  = tileSet.tile(2, 1);
		textureTiles[Id.BLOCK_MARKED_CYAN]  = tileSet.tile(2, 2);
		textureTiles[Id.BLOCK_MARKED_MAGENTA]  = tileSet.tile(2, 3);
		textureTiles[Id.BLOCK_MARKED_YELLOW]  = tileSet.tile(2, 4);
		textureTiles[Id.BLOCK_MARKED_BLUE]  = tileSet.tile(2, 5);

		textureTiles[Id.SELECTOR] = tileSet.tile(4, 0);
		textureTiles[Id.STAGE] = tileSet.tile(4, 1);
		textureTiles[Id.EXPLOSION] = tileSet.tile(4, 2);

		function getTile(id) {
			return textureTiles[id];
		}

		return {
			getTile: getTile
		};
	};

	return root;

}(BC || {}))