var BC = (function(root) {

	var parent = root.Menu = root.Menu || {};
	var me = parent.Credits = parent.Credits || {};

	me.make = function() {
		var MENU_FADE_SPEED = "slow";

		var menu;

		function refresh() {
			if (!menu) {
				menu = $("#credits-menu");
				$("#close-button", menu).click(function() {
					hide();
				});
			}
		}

		function show() {
			refresh();
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