var BC = (function(root) {

	var parent = root.Menu = root.Menu || {};
	var me = parent.Game = parent.Game || {};

	me.make = function() {
		var MENU_FADE_SPEED = "slow";

		var gameMenu = $("#game-menu");
		var pauseButton = $("#pause-button", gameMenu);

		var gmSpeedLevelView = BC.Stat.View.make($("#speed-level-stat", gameMenu));
		var gmElapsedTimeView = BC.Stat.View.make($("#elapsed-time-stat", gameMenu));
		var gmScoreView = BC.Stat.View.make($("#score-stat", gameMenu));

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