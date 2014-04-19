var BC = (function(parent) {

	var my = parent.Animation = parent.Animation || {};

	my.make = function(args) {
		var duration = args.duration;
		var startCallback = args.startCallback;
		var updateCallback = args.updateCallback;
		var finishCallback = args.finishCallback;

		var elapsedTime = 0;
		var started = false;
		var done = false;

		function update(watch) {
			if (!started) {
				started = true;
				startCallback();
			}

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

	my.process = function(animations, watch) {
		var changed = false;
		if (animations.length > 0) {
			var currentAnimation = animations[0];
			changed |= currentAnimation.update(watch);
			if (currentAnimation.isDone()) {
				animations.shift();
			}
		}
		return changed;
	};

	return parent;

}(BC || {}))