var BC = (function(root) {

	var parent = root.Menu = root.Menu || {};
	var me = parent.Options = parent.Options || {};

	me.make = function(args) {
		var controller = args.controller;

		var menu = $("#options-menu");
		var upButton = $("#up-button", menu);
		var closeButton = $("#close-button", menu);

		upButton.click(function() {
			upButton.text("");
		});

		closeButton.click(function() {
			hide();
		});

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