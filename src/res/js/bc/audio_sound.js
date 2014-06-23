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

	var me = root.Audio = root.Audio || {};

	function newSound(offset, duration) {
		return {
			offset: offset,
			duration: duration
		};
	}

	me.Sound = {
		BUTTON_HOVER: newSound(1, 0.5),
		BUTTON_CLICK: newSound(0, 0.75),
		SELECTOR_MOVEMENT: newSound(1, 0.5),
		CELL_SWAP: newSound(2, 0.5),
		CELL_CLEAR: newSound(3, 0.5)
	};

	return root;

}(BC || {}))