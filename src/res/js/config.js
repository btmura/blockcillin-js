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

		var SECONDS_PER_UPDATE = 0.016;

		var SWAP_ANIMATION_UPDATES = fromSeconds(0.1);
		var MOVE_ANIMATION_UPDATES = fromSeconds(0.1);
		var FLICKER_ANIMATION_UPDATES = fromSeconds(0.5);
		var FREEZE_ANIMATION_UPDATES = fromSeconds(0.25);
		var FADE_ANIMATION_UPDATES = fromSeconds(0.25);

		var RAISE_AMOUNT = 0.2;
		var RAISE_ANIMATION_UPDATES = fromSeconds(0.5);

		var SELECTOR_SCALE_SPEED_MULTIPLIER = 0.05;
		var SELECTOR_SCALE_AMPLITUDE_DIVISOR = 25;

		var YELLOW_BOOST_SPEED_MULTIPLIER = 150;
		var YELLOW_BOOST_AMPLITUDE_DIVISOR = 2;

		// fromSeconds converts a duration into update count.
		function fromSeconds(seconds) {
			return Math.ceil(seconds / SECONDS_PER_UPDATE);
		}

		// getSecondsPerUpdate returns the interval between updates.
		function getSecondsPerUpdate() {
			return SECONDS_PER_UPDATE;
		}

		// getUpdatesPerSwap returns how many updates swapping blocks takes.
		function getUpdatesPerSwap() {
			return SWAP_ANIMATION_UPDATES;
		}

		// getUpdatesPerRaise returns how many updates it takes to raise the board.
		function getUpdatesPerRaise() {
			return RAISE_ANIMATION_UPDATES;
		}

		// getRaiseAmount returns how much to multiply the rise speed when the raise key is pressed.
		function getRaiseAmountPerUpdate() {
			return RAISE_AMOUNT / RAISE_ANIMATION_UPDATES;
		}

		// getUpdatesPerMove returns how many updates moving the selector takes.
		function getUpdatesPerMove() {
			return MOVE_ANIMATION_UPDATES;
		}

		// getUpdatesPerFlicker returns how many updates the blocks will flicker.
		function getUpdatesPerFlicker() {
			return FLICKER_ANIMATION_UPDATES;
		}

		// getUpdatesPerFreeze returns how many updates the blocks will freeze.
		function getUpdatesPerFreeze() {
			return FREEZE_ANIMATION_UPDATES;
		}

		// getUpdatesPerFade returns how many updates the blocks will take to fade out.
		function getUpdatesPerFade() {
			return FADE_ANIMATION_UPDATES;
		}

		// getSelectorScale calculates the selector's scale value given a changing step value.
		function getSelectorScale(step) {
			return 1 + Math.abs(Math.sin(step * SELECTOR_SCALE_SPEED_MULTIPLIER)) / SELECTOR_SCALE_AMPLITUDE_DIVISOR;
		}

		// getYellowBoost calculates the yellow boost value given a changing step value.
		function getYellowBoost(step) {
			return Math.abs(Math.sin(step * YELLOW_BOOST_SPEED_MULTIPLIER) / YELLOW_BOOST_AMPLITUDE_DIVISOR);
		}

		return {
			getSecondsPerUpdate: getSecondsPerUpdate,
			getUpdatesPerSwap: getUpdatesPerSwap,
			getUpdatesPerRaise: getUpdatesPerRaise,
			getRaiseAmountPerUpdate: getRaiseAmountPerUpdate,
			getUpdatesPerMove: getUpdatesPerMove,
			getUpdatesPerFlicker: getUpdatesPerFlicker,
			getUpdatesPerFreeze: getUpdatesPerFreeze,
			getUpdatesPerFade: getUpdatesPerFade,
			getSelectorScale: getSelectorScale,
			getYellowBoost: getYellowBoost
		};
	};

	return root;

}(BC || {}));
