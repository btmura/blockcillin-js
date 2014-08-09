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

	var parent = root.Menu = root.Menu || {};
	var me = parent.Credits = parent.Credits || {};

	me.make = function() {
		var MENU_FADE_SPEED = "slow";

		var menu;

		function refresh() {
			if (!menu) {
				menu = $("#credits-menu");
				$("#close-button", menu).click(function() {
					hide();
				});
			}
		}

		function show() {
			refresh();
			menu.fadeIn(MENU_FADE_SPEED);
		}

		function hide() {
			menu.fadeOut(MENU_FADE_SPEED);
		}

		return {
			show: show,
			hide: hide
		};
	};

	return root;

}(BC || {}))