var BC = (function(root) {

	var parent = root.Audio = root.Audio || {};
	var me = parent.Player = parent.Player || {};

	me.Sound = {
		BUTTON_CLICK: 0,
		SELECTOR_MOVEMENT: 1,
		CELL_SWAP: 2,
		CELL_CLEAR: 3
	};

	me.make = function() {
		var Sound = me.Sound;

		// Fix up prefixing of AudioContext.
		window.AudioContext = window.AudioContext || window.webkitAudioContext;
		var context = new AudioContext();

		var buffers = {};

		loadSound(Sound.BUTTON_CLICK, "audio/button_click.ogg");
		loadSound(Sound.SELECTOR_MOVEMENT, "audio/selector.ogg");
		loadSound(Sound.CELL_SWAP, "audio/cell_swap.ogg");
		loadSound(Sound.CELL_CLEAR, "audio/cell_clear.ogg");

		function loadSound(sound, url) {
			var request = new XMLHttpRequest();
			request.open("GET", url, true);
			request.responseType = "arraybuffer";

			request.onload = function() {
				function onDecodeSuccess(buffer) {
					buffers[sound] = buffer;
				}

				function onDecodeError() {
					BC.Util.error("error decoding data for " + url);
				}

				context.decodeAudioData(request.response, onDecodeSuccess, onDecodeError);
			};

			request.send();
		}

		function playSound(buffer) {
			if (buffer) {
				var source = context.createBufferSource();
				source.buffer = buffer;
				source.connect(context.destination);
				source.start(0);
			}
		}

		function play(sound) {
			playSound(buffers[sound]);
		}

		return {
			play: play
		};
	};

	return root;

}(BC || {}))