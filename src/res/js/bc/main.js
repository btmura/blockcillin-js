var BC = (function(root) {

	var me = root.Main = root.Main || {};

	me.run = function() {
		var Sound = BC.Audio.Sound;

		var FLICKER_DURATION = 20;

		var canvas = document.getElementById("canvas");
		if (!canvas) {
			return;
		}

		var storage = BC.Common.Storage.make();

		var controller = BC.Controller.make({
			canvas: canvas,
			storage: storage
		});

		var statBoard = BC.Game.StatBoard.make({
			storage: storage
		});

		var audioPlayer = BC.Audio.Player.make();

		var mainMenu = BC.Menu.Main.make();
		var gameMenu = BC.Menu.Game.make();
		var statsMenu = BC.Menu.Stats.make({
			statBoard: statBoard
		});
		var optionsMenu = BC.Menu.Options.make({
			controller: controller
		});
		var creditsMenu = BC.Menu.Credits.make();

		var game = BC.Game.make({
			storage: storage,
			canvas: canvas,
			controller: controller,
			audioPlayer: audioPlayer,
			gmSpeedLevelView: gameMenu.getSpeedLevelView(),
			gmElapsedTimeView: gameMenu.getElapsedTimeView(),
			gmScoreView: gameMenu.getScoreView(),
			statBoard: statBoard
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

		var buttons = $(".button");

		buttons.click(function(event) {
			audioPlayer.play(Sound.BUTTON_CLICK);
			flicker($(event.target));
		});

		buttons.mouseenter(function() {
			audioPlayer.play(Sound.BUTTON_HOVER);
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

		function flicker(element) {
			element.fadeIn(FLICKER_DURATION)
				.fadeOut(FLICKER_DURATION)
				.fadeIn(FLICKER_DURATION)
				.fadeOut(FLICKER_DURATION)
				.fadeIn(FLICKER_DURATION);
		}

		showMainMenu(true);
	}

	return root;

}(BC || {}));

$(document).ready(function() {
	BC.Main.run();
});
