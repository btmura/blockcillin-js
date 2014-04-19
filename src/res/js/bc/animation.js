var BC = (function(parent) {

	var my = parent.Animation = parent.Animation || {};

	my.make = function(args) {
		var duration = args.duration;
		var updateCallback = args.updateCallback;
		var finishCallback = args.finishCallback;

		var elapsedTime = 0;

		function update(watch) {
			var deltaTime = watch.deltaTime;
			if (elapsedTime + deltaTime > duration) {
				deltaTime = duration - elapsedTime;
			}

			updateCallback();

			elapsedTime += deltaTime;
			if (elapsedTime >= duration) {
				finishCallback();
			}
		}

		return {
			update: update
		};
	};

	return parent;

}(BC || {}))