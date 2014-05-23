var BC = (function(root) {

	var me = root.StopWatch = root.StopWatch || {};

	me.make = function() {
		function getTimeInSeconds() {
			return Date.now() * 0.001;
		}

		var watch = {
			reset: reset,
			tick: tick
		};

		function reset() {
			watch.then = getTimeInSeconds();
		}

		function tick() {
			watch.now = getTimeInSeconds();
			watch.deltaTime = watch.now - watch.then;
			watch.then = watch.now;
		}

		reset();
		return watch;
	};

	return root;

}(BC || {}))
