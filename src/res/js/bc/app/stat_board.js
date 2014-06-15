var BC = (function(root) {

	var parent = root.App = root.App || {};
	var me = parent.StatBoard = parent.StatBoard || {};

	me.make = function(args) {
		var STORAGE_KEY = "bc.stats";

		var storage = args.storage;

		function addStats(newStats) {
			var stats = getStats();
			stats.push(newStats);
			storage.set(STORAGE_KEY, JSON.stringify(stats));
		}

		function getStats() {
			var json = storage.get(STORAGE_KEY);
			if (json) {
				return JSON.parse(json);
			}
			return [];
		}

		return {
			addStats: addStats,
			getStats: getStats
		};
	};

	return root;

}(BC || {}))