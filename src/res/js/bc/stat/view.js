var BC = (function(root) {

	// TODO(btmura): put views in a separate module so they can share code
	var parent = root.Stat = root.Stat || {};
	var me = parent.View = parent.View || {};

	var displayFuncs;

	me.make = function(element) {
		if (!displayFuncs) {
			var Unit = BC.Stat.Unit;
			displayFuncs = {};
			displayFuncs[Unit.INTEGER] = function(value) {
				return value;
			};
			displayFuncs[Unit.SECONDS] = function(value) {
				var hours = Math.floor(value / 3600);
				value -= hours * 3600;

				var minutes = Math.floor(value / 60);
				value -= minutes * 60;

				var seconds = Math.floor(value);

				if (hours < 10) {
					hours = "0" + hours;
				}
				if (minutes < 10) {
					minutes = "0" + minutes;
				}
				if (seconds < 10) {
					seconds = "0" + seconds;
				}

				return hours + ":" + minutes + ":" + seconds;
			};
		}

		function draw(stat) {
			var df = displayFuncs[stat.unit];
			element.text(df(stat.value));
		}

		return {
			draw: draw
		};
	};

	return root;

}(BC || {}))