var BC = (function(parent) {

	var my = parent.StopWatch = parent.StopWatch || {};

	my.make = function() {
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

	return parent;

}(BC || {}))
