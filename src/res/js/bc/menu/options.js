var BC = (function(root) {

	var parent = root.Menu = root.Menu || {};
	var me = parent.Options = parent.Options || {};

	me.make = function() {
		var menu = $("#options-menu");

		function show() {
			menu.show();
		}

		function hide() {
			menu.hide();
		}

		return {
			show: show,
			hide: hide
		};
	};

	return root;

}(BC || {}))