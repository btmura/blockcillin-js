var BC = (function(root) {

	var me = root.Main = root.Main || {};

	me.run = function() {
		var Sound = BC.Audio.Sound;

		var MAIN_MENU_GAME_TITLE = "b l o c k c i l l i n";
		var MAIN_MENU_PAUSED_TITLE = "P A U S E D";
		var MAIN_MENU_GAME_OVER_TITLE = "G A M E  O V E R";
		var MENU_DURATION = "slow";
		var FLICKER_DURATION = 20;

		var mainMenu = $("#main-menu");
		var mainMenuTitle = $("#main-menu-title", mainMenu);
		var mainMenuStats = $("#main-menu-stats", mainMenu);

		var continueButton = $("#continue-button", mainMenu);
		var newGameButton = $("#new-game-button", mainMenu);
		var statsButton = $("#stats-button", mainMenu);
		var optionsButton = $("#options-button", mainMenu);
		var creditsButton = $("#credits-button", mainMenu);

		var mmSpeedLevelView = BC.View.Stat.make($("#speed-level-stat", mainMenu));
		var mmElapsedTimeView = BC.View.Stat.make($("#elapsed-time-stat", mainMenu));
		var mmScoreView = BC.View.Stat.make($("#score-stat", mainMenu));

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
			storage: storage,
			canvas: canvas
		});

		var audioPlayer = BC.Audio.Player.make();

		var statBoard = BC.Game.StatBoard.make({
			storage: storage
		});

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

		showMainMenu(true);

		continueButton.click(function() {
			game.resume();
		});

		newGameButton.click(function() {
			game.start();
		});

		statsButton.click(function() {
			setVisible(statsMenu, true);
		});

		optionsButton.click(function() {
			setVisible(optionsMenu, true);
		});

		creditsButton.click(function() {
			setVisible(creditsMenu, true);
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
				mainMenuTitle.text(getMainMenuTitle());
				showMainMenuStats(game.isStarted() || game.isGameOver());
				setVisible(continueButton, game.isStarted());
				mainMenu.fadeIn(MENU_DURATION);
				gameMenu.fadeOut(MENU_DURATION);
			} else {
				mainMenu.fadeOut(MENU_DURATION);
				gameMenu.fadeIn(MENU_DURATION);
			}
		}

		function getMainMenuTitle() {
			if (game.isGameOver()) {
				return MAIN_MENU_GAME_OVER_TITLE;
			} else if (game.isStarted() && game.isPaused()) {
				return MAIN_MENU_PAUSED_TITLE;
			} else {
				return MAIN_MENU_GAME_TITLE;
			}
		}

		function showMainMenuStats(show) {
			// Update stats only on display and leave them the same as the menu fades out.
			if (show) {
				mmSpeedLevelView.draw(game.getSpeedLevel());
				mmScoreView.draw(game.getScore());
				mmElapsedTimeView.draw(game.getElapsedTime());
			}
			setVisible(mainMenuStats, show);
		}

		function flicker(element) {
			element.fadeIn(FLICKER_DURATION)
				.fadeOut(FLICKER_DURATION)
				.fadeIn(FLICKER_DURATION)
				.fadeOut(FLICKER_DURATION)
				.fadeIn(FLICKER_DURATION);
		}

		function setVisible(element, show) {
			if (show) {
				element.show();
			} else {
				element.hide();
			}
		}
	}

	return root;

}(BC || {}));

$(document).ready(function() {
	BC.Main.run();
});
