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

	root.Direction = {
		NONE : "NONE",
		UP : "UP",
		DOWN: "DOWN",
		LEFT: "LEFT",
		RIGHT: "RIGHT"
	};

	return root;

}(BC || {}))