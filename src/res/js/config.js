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

		var SEC_PER_UPDATE = 0.008;
		var UPDATES_PER_SWAP = 15;

		// getSecondsPerUpdate returns the interval between updates.
		function getSecondsPerUpdate() {
			return SEC_PER_UPDATE;
		}

		// getUpdatesPerSwap returns how many updates swapping blocks takes.
		function getUpdatesPerSwap() {
			return UPDATES_PER_SWAP;
		}

		return {
			getSecondsPerUpdate: getSecondsPerUpdate,
			getUpdatesPerSwap: getUpdatesPerSwap
		};
	};

	return root;

}(BC || {}));
