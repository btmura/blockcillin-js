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

	var me = root.Main = root.Main || {};

	me.run = function() {
		var canvas = document.getElementById("canvas");
		if (!canvas) {
			return;
		}

		var gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
		if (!gl) {
			return;
		}

		var storage = BC.Storage.make();
		var controller = BC.Controller.make({
			canvas: canvas,
			storage: storage
		});
		var statBoard = BC.StatBoard.make({
			storage: storage
		});
		var audioPlayer = BC.Audio.Player.make();

		var mainMenu = BC.Menu.Main.make({
			audioPlayer: audioPlayer
		});
		var gameMenu = BC.Menu.Game.make();
		var statsMenu = BC.Menu.Stats.make({
			statBoard: statBoard
		});
		var optionsMenu = BC.Menu.Options.make({
			controller: controller
		});
		var creditsMenu = BC.Menu.Credits.make();

		var game = BC.Game.make({
			gl: gl,
			storage: storage,
			controller: controller,
			statBoard: statBoard,
			audioPlayer: audioPlayer,
			gmSpeedLevelView: gameMenu.getSpeedLevelView(),
			gmElapsedTimeView: gameMenu.getElapsedTimeView(),
			gmScoreView: gameMenu.getScoreView()
		});

		mainMenu.setContinueListener(function() {
			game.resume();
		});
		mainMenu.setNewGameListener(function() {
			game.start();
		});
		mainMenu.setStatsListener(function() {
			statsMenu.show();
		});
		mainMenu.setOptionsListener(function() {
			optionsMenu.show();
		});
		mainMenu.setCreditsListener(function() {
			creditsMenu.show();
		});

		gameMenu.setPauseListener(function() {
			game.pause();
		});

		game.setResumeListener(function() {
			showMainMenu(false);
		});
		game.setPauseListener(function() {
			showMainMenu(true);
		});
		game.setGameOverListener(function() {
			showMainMenu(true);
		});

		controller.setMenuActionListener(function() {
			if (!game.isPaused()) {
				game.pause();
			} else {
				game.resume();
			}
		});

		document.addEventListener("visibilitychange", function() {
			if (document.hidden) {
				game.pause();
			}
		});

		function showMainMenu(show) {
			if (show) {
				mainMenu.show(game);
				gameMenu.hide();
			} else {
				mainMenu.hide();
				gameMenu.show();
			}
		}

		showMainMenu(true);
	};

	return root;

}(BC || {}));

$(document).ready(function() {
	BC.Main.run();
});
