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
	var me = parent.Stats = parent.Stats || {};

	me.make = function(args) {
		var MENU_FADE_SPEED = "slow";
		var MAX_STATS = 5;

		var statBoard = args.statBoard;

		var menu = $("#stats-menu");
		var noStatsLabel = $("#no-stats-label", menu);
		var closeButton = $("#close-button", menu);

		var entries = [];
		var views = [];
		for (var i = 1; i <= MAX_STATS; i++) {
			var entry = $("#stats-entry-" + i, menu);
			entries.push(entry);

			function makeView(id) {
				return BC.Quantity.View.make($(id, entry));
			}

			views.push({
				speedLevel: makeView("#speed-level-stat"),
				elapsedTime: makeView("#elapsed-time-stat"),
				score: makeView("#score-stat")
			});
		}

		var models = {
			speedLevel: BC.Quantity.make(),
			elapsedTime: BC.Quantity.make({unit: BC.Unit.SECONDS}),
			score: BC.Quantity.make()
		};

		closeButton.click(function() {
			hide();
		});

		function show() {
			refresh();
			menu.fadeIn(MENU_FADE_SPEED);
		}

		function refresh() {
			var stats = statBoard.getStats();

			if (stats.length == 0) {
				noStatsLabel.show();
			} else {
				noStatsLabel.hide();
			}

			for (var i = 0; i < entries.length; i++) {
				if (i < stats.length) {
					models.speedLevel.value = stats[i].speedLevel;
					models.elapsedTime.value = stats[i].elapsedTime;
					models.score.value = stats[i].score;

					views[i].speedLevel.draw(models.speedLevel);
					views[i].elapsedTime.draw(models.elapsedTime);
					views[i].score.draw(models.score);

					entries[i].show();
				} else {
					entries[i].hide();
				}
			}
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