var BC = (function(root) {

	var parent = root.Score = root.Score || {};
	var me = parent.View = parent.View || {};

	me.make = function() {

		function draw() {
		}

		return {
			draw: draw
		};
	};

	return root;

}(BC || {}))