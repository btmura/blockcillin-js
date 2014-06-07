var BC = (function(root) {

	var parent = root.Menu = root.Menu || {};
	var me = parent.Options = parent.Options || {};

	me.make = function(args) {
		var Key = BC.Controller.Key;

		var controller = args.controller;

		var menu = $("#options-menu");
		var upButton = $("#up-button", menu);
		var downButton = $("#down-button", menu);
		var leftButton = $("#left-button", menu);
		var rightButton = $("#right-button", menu);
		var swapButton = $("#swap-button", menu);
		var closeButton = $("#close-button", menu);

		function setupButton(button, key) {
			button.text(controller.getKeyCode(key));
			button.click(function() {
				button.text(" ");
				controller.assign(key, function(keyCode) {
					button.text(keyCode);
				});
			});
		}

		setupButton(upButton, Key.UP);
		setupButton(downButton, Key.DOWN);
		setupButton(leftButton, Key.LEFT);
		setupButton(rightButton, Key.RIGHT);
		setupButton(swapButton, Key.PRIMARY_ACTION);

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