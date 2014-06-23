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

	var me = root.StatBoard = root.StatBoard || {};

	me.make = function(args) {
		var STORAGE_KEY = "bc.stats";
		var MAX_STATS = 5;

		var storage = args.storage;

		function getStats() {
			var json = storage.get(STORAGE_KEY);
			if (json) {
				return JSON.parse(json);
			}
			return [];
		}

		function addStats(newStats) {
			var stats = getStats();
			stats.push(newStats);
			stats.sort(comparator);
			stats.slice(0, MAX_STATS);
			storage.set(STORAGE_KEY, JSON.stringify(stats));
		}

		function comparator(s1, s2) {
			var diff = s2.score - s1.score;
			if (diff !== 0) {
				return diff;
			}

			var diff = s2.elapsedTime - s1.elapsedTime;
			if (diff !== 0) {
				return diff;
			}

			return s2.speedLevel - s1.speedLevel;
		}

		return {
			getStats: getStats,
			addStats: addStats
		};
	};

	return root;

}(BC || {}))