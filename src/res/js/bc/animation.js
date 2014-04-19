var BC = (function(parent) {

	var my = parent.Animation = parent.Animation || {};

	my.make = function(args) {
		var duration = args.duration;
		var startCallback = args.startCallback;
		var updateCallback = args.updateCallback;
		var finishCallback = args.finishCallback;

		var elapsedTime = 0;
		var done = false;

		startCallback();

		function update(watch) {
			var deltaTime = watch.deltaTime;
			if (elapsedTime + deltaTime > duration) {
				deltaTime = duration - elapsedTime;
			}

			elapsedTime += deltaTime;

			var result = updateCallback({
				now: watch.now,
				deltaTime: deltaTime,
				elapsedPercent: elapsedTime / duration,
				deltaPercent: deltaTime / duration
			});

			if (elapsedTime >= duration) {
				finishCallback();
				done = true;
			}

			return result;
		}

		function isDone() {
			return done;
		}

		return {
			update: update,
			isDone: isDone
		};
	};

	return parent;

}(BC || {}))