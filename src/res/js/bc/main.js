var BC = (function(root) {

	var me = root.Main = root.Main || {};

	me.run = function() {
		var Sound = BC.Audio.Sound;

		var MENU_DURATION = "slow";
		var FLICKER_DURATION = 20;

		var gameMenu = $("#game-menu");
		var pauseButton = $("#pause-button", gameMenu);

		var gmSpeedLevelView = BC.View.Stat.make($("#speed-level-stat", gameMenu));
		var gmElapsedTimeView = BC.View.Stat.make($("#elapsed-time-stat", gameMenu));
		var gmScoreView = BC.View.Stat.make($("#score-stat", gameMenu));

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
			gmSpeedLevelView: gmSpeedLevelView,
			gmElapsedTimeView: gmElapsedTimeView,
			gmScoreView: gmScoreView,
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

		pauseButton.click(function() {
			game.pause();
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
				gameMenu.fadeOut(MENU_DURATION);
			} else {
				mainMenu.hide();
				gameMenu.fadeIn(MENU_DURATION);
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
