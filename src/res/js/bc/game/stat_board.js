var BC = (function(root) {

	var parent = root.Game = root.Game || {};
	var me = parent.StatBoard = parent.StatBoard || {};

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