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
	var me = parent.Main = parent.Main || {};

	me.make = function(args) {
		var Sound = BC.Audio.Sound;

		var FLICKER_DURATION = 20;

		var MAIN_MENU_GAME_TITLE = "b l o c k c i l l i n";
		var MAIN_MENU_PAUSED_TITLE = "P A U S E D";
		var MAIN_MENU_GAME_OVER_TITLE = "G A M E  O V E R";
		var MENU_FADE_SPEED = "slow";

		var mainMenu = $("#main-menu");
		var mainMenuTitle = $("#main-menu-title", mainMenu);
		var mainMenuStats = $("#main-menu-stats", mainMenu);

		var continueButton = $("#continue-button", mainMenu);
		var newGameButton = $("#new-game-button", mainMenu);
		var statsButton = $("#stats-button", mainMenu);
		var optionsButton = $("#options-button", mainMenu);
		var creditsButton = $("#credits-button", mainMenu);

		var mmSpeedLevelView = BC.Quantity.View.make($("#speed-level-stat", mainMenu));
		var mmElapsedTimeView = BC.Quantity.View.make($("#elapsed-time-stat", mainMenu));
		var mmScoreView = BC.Quantity.View.make($("#score-stat", mainMenu));

		var audioPlayer = args.audioPlayer;

		var buttons = $(".button");

		buttons.click(function(event) {
			audioPlayer.play(Sound.BUTTON_CLICK);
			flicker($(event.target));
		});

		buttons.mouseenter(function() {
			audioPlayer.play(Sound.BUTTON_HOVER);
		});

		function flicker(element) {
			element.fadeIn(FLICKER_DURATION)
				.fadeOut(FLICKER_DURATION)
				.fadeIn(FLICKER_DURATION)
				.fadeOut(FLICKER_DURATION)
				.fadeIn(FLICKER_DURATION);
		}

		var continueCallback = function() {};
		var newGameCallback = function() {};
		var statsCallback = function() {};
		var optionsCallback = function() {};
		var creditsCallback = function() {};

		function setContinueListener(callback) {
			continueCallback = callback;
		}

		function setNewGameListener(callback) {
			newGameCallback = callback;
		}

		function setStatsListener(callback) {
			statsCallback = callback;
		}

		function setOptionsListener(callback) {
			optionsCallback = callback;
		}

		function setCreditsListener(callback) {
			creditsCallback = callback;
		}

		continueButton.click(function() {
			continueCallback();
		});

		newGameButton.click(function() {
			newGameCallback();
		});

		statsButton.click(function() {
			statsCallback();
		});

		optionsButton.click(function() {
			optionsCallback();
		});

		creditsButton.click(function() {
			creditsCallback();
		});

		function show(game) {
			mainMenuTitle.text(getMainMenuTitle(game));
			showMainMenuStats(game, game.isStarted() || game.isGameOver());
			setVisible(continueButton, game.isStarted());
			mainMenu.fadeIn(MENU_FADE_SPEED);
		}

		function getMainMenuTitle(game) {
			if (game.isGameOver()) {
				return MAIN_MENU_GAME_OVER_TITLE;
			} else if (game.isStarted() && game.isPaused()) {
				return MAIN_MENU_PAUSED_TITLE;
			} else {
				return MAIN_MENU_GAME_TITLE;
			}
		}

		function showMainMenuStats(game, show) {
			// Update stats only on display and leave them the same as the menu fades out.
			if (show) {
				mmSpeedLevelView.draw(game.getSpeedLevel());
				mmScoreView.draw(game.getScore());
				mmElapsedTimeView.draw(game.getElapsedTime());
			}
			setVisible(mainMenuStats, show);
		}

		function setVisible(element, show) {
			if (show) {
				element.show();
			} else {
				element.hide();
			}
		}

		function hide() {
			mainMenu.fadeOut(MENU_FADE_SPEED);
		}

		return {
			setContinueListener: setContinueListener,
			setNewGameListener: setNewGameListener,
			setStatsListener: setStatsListener,
			setOptionsListener: setOptionsListener,
			setCreditsListener: setCreditsListener,
			show: show,
			hide: hide
		};
	};

	return root;

}(BC || {}))