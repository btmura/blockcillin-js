var BC = (function(root) {

	var me = root.Menu = root.Menu || {};

	me.init = function(args) {
		var Sound = BC.Audio.Sound;

		var FLICKER_DURATION = 20;

		var audioPlayer = args.audioPlayer;

		var buttons = $(".button");

		buttons.click(function(event) {
			audioPlayer.play(Sound.BUTTON_CLICK);
			flicker($(event.target));
		});

		buttons.mouseenter(function() {
			audioPlayer.play(Sound.BUTTON_HOVER);
		});

		function flicker(element) {
			element.fadeIn(FLICKER_DURATION)
				.fadeOut(FLICKER_DURATION)
				.fadeIn(FLICKER_DURATION)
				.fadeOut(FLICKER_DURATION)
				.fadeIn(FLICKER_DURATION);
		}
	};

	return root;

}(BC || {}));