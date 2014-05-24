var BC = (function(root) {

	var parent = root.Audio = root.Audio || {};
	var me = parent.Player = parent.Player || {};

	me.make = function() {
		var Sound = BC.Audio.Sound;

		// Fix up prefixing of AudioContext.
		window.AudioContext = window.AudioContext || window.webkitAudioContext;
		var context = new AudioContext();

		var buffer;

		loadFile("audio/sounds.ogg");

		function loadFile(url) {
			var request = new XMLHttpRequest();
			request.open("GET", url, true);
			request.responseType = "arraybuffer";

			request.onload = function() {
				function onDecodeSuccess(newBuffer) {
					buffer = newBuffer;
				}

				function onDecodeError() {
					BC.Util.error("error decoding data for " + url);
				}

				context.decodeAudioData(request.response, onDecodeSuccess, onDecodeError);
			};

			request.send();
		}

		function playSound(buffer, when, offset, duration) {
			var source = context.createBufferSource();
			source.buffer = buffer;
			source.connect(context.destination);
			source.start(when, offset, duration);
		}

		function play(sound) {
			// Play sounds only if the buffer is ready.
			if (buffer) {
				playSound(buffer, 0, sound.offset, sound.duration);
			}
		}

		return {
			play: play
		};
	};

	return root;

}(BC || {}))