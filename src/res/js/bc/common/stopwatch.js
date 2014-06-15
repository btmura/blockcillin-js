var BC = (function(root) {

	var parent = root.Common = root.Common || {};
	var me = parent.StopWatch = parent.StopWatch || {};

	me.make = function(args) {
		var clock = args.clock;

		function getTimeInSeconds() {
			return clock.now() * 0.001;
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
