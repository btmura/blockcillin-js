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
	var me = parent.Game = parent.Game || {};

	me.make = function() {
		var MENU_FADE_SPEED = "slow";

		var gameMenu = $("#game-menu");
		var pauseButton = $("#pause-button", gameMenu);

		var gmSpeedLevelView = BC.Quantity.View.make($("#speed-level-stat", gameMenu));
		var gmElapsedTimeView = BC.Quantity.View.make($("#elapsed-time-stat", gameMenu));
		var gmScoreView = BC.Quantity.View.make($("#score-stat", gameMenu));

		var pauseCallback = function() {};

		function setPauseListener(callback) {
			pauseCallback = callback;
		}

		pauseButton.click(function() {
			pauseCallback();
		});

		function show() {
			gameMenu.fadeIn(MENU_FADE_SPEED);
		}

		function hide() {
			gameMenu.fadeOut(MENU_FADE_SPEED);
		}

		function getSpeedLevelView() {
			return gmSpeedLevelView;
		}

		function getElapsedTimeView() {
			return gmElapsedTimeView;
		}

		function getScoreView() {
			return gmScoreView;
		}

		return {
			setPauseListener: setPauseListener,
			show: show,
			hide: hide,
			getSpeedLevelView: getSpeedLevelView,
			getElapsedTimeView: getElapsedTimeView,
			getScoreView: getScoreView
		};
	};

	return root;

}(BC || {}))