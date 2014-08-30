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

	// Config is a central place to configure all aspects of the game.
	var me = root.Config = root.Config || {};

	// make makes a new Config object.
	me.make = function(args) {

		var SECONDS_PER_UPDATE = 0.008;

		var SWAP_ANIMATION_SECONDS = 0.1;
		var MOVE_ANIMATION_SECONDS = 0.1;

		var SWAP_ANIMATION_UPDATES = Math.ceil(SWAP_ANIMATION_SECONDS / SECONDS_PER_UPDATE);
		var MOVE_ANIMATION_UPDATES = Math.ceil(MOVE_ANIMATION_SECONDS / SECONDS_PER_UPDATE);

		// getSecondsPerUpdate returns the interval between updates.
		function getSecondsPerUpdate() {
			return SECONDS_PER_UPDATE;
		}

		// getUpdatesPerSwap returns how many updates swapping blocks takes.
		function getUpdatesPerSwap() {
			return SWAP_ANIMATION_UPDATES;
		}

		// getUpdatesPerMove returns how many updates moving the selector takes.
		function getUpdatesPerMove() {
			return MOVE_ANIMATION_UPDATES;
		}

		return {
			getSecondsPerUpdate: getSecondsPerUpdate,
			getUpdatesPerSwap: getUpdatesPerSwap,
			getUpdatesPerMove: getUpdatesPerMove,
		};
	};

	return root;

}(BC || {}));
