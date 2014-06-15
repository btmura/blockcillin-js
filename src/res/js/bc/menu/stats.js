var BC = (function(root) {

	var parent = root.Menu = root.Menu || {};
	var me = parent.Stats = parent.Stats || {};

	me.make = function(args) {
		var MENU_FADE_SPEED = "slow";

		var storage = args.storage;

		var menu = $("#stats-menu");
		var noStatsLabel = $("#no-stats-label", menu);
		var entries = [
			$("#stats-menu-entry-1", menu),
			$("#stats-menu-entry-2", menu),
			$("#stats-menu-entry-3", menu),
			$("#stats-menu-entry-4", menu),
			$("#stats-menu-entry-5", menu)
		];
		var closeButton = $("#close-button", menu);

		closeButton.click(function() {
			hide();
		});

		function refresh() {
			var stats = JSON.parse(storage.get("bc.stats") || "[]");

			if (stats.length == 0) {
				noStatsLabel.show();
			} else {
				noStatsLabel.hide();
			}

			for (var i = 0; i < entries.length; i++) {
				if (i < stats.length) {
					var speedLevelStat = $("#speed-level-stat", entries[i]);
					speedLevelStat.text(stats[i].speedLevel);

					var elapsedTimeStat = $("#elapsed-time-stat", entries[i]);
					elapsedTimeStat.text(stats[i].elapsedTime);

					var scoreStat = $("#score-stat", entries[i]);
					scoreStat.text(stats[i].score);

					entries[i].show();
				} else {
					entries[i].hide();
				}
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