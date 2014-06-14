var BC = (function(root) {

	var parent = root.Menu = root.Menu || {};
	var me = parent.Stats = parent.Stats || {};

	me.make = function(args) {
		var MENU_FADE_SPEED = "slow";

		var menu = $("#stats-menu");
		var closeButton = $("#stats-close-button", menu);

		closeButton.click(function() {
			hide();
		});

		function show() {
			menu.fadeIn(MENU_FADE_SPEED);
		}

		function hide() {
			menu.fadeOut(MENU_FADE_SPEED);
		}

		return {
			show: show,
			hide: hide
		};
	};

	return root;

}(BC || {}))