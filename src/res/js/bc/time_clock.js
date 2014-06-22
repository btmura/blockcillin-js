var BC = (function(root) {

	var parent = root.Time = root.Time || {};
	var me = parent.Clock = parent.Clock || {};

	me.make = function() {
		function now() {
			return Date.now(); // ms since epoch
		}

		return {
			now: now
		};
	};

	return root;

}(BC || {}))