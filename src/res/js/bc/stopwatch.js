var BC = (function(parent) {

	var my = parent.StopWatch = parent.StopWatch || {}

	my.make = function() {
		function getTimeInSeconds() {
			return Date.now() * 0.001;
		}

		var watch = {
			then: getTimeInSeconds(),
			tick: tick
		};

		function tick() {
			watch.now = getTimeInSeconds();
			watch.deltaTime = watch.now - watch.then;
			watch.then = watch.now;
		}

		return watch;
	};

	return parent;

}(BC || {}))
