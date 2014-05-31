var BC = (function(root) {

	var parent = root.Stat = root.Stat || {};
	var me = parent.View = parent.View || {};

	me.make = function(selector) {
		var element = $(selector);

		function draw(stat) {
			element.text(stat.value);
		}

		return {
			draw: draw
		};
	};

	return root;

}(BC || {}))