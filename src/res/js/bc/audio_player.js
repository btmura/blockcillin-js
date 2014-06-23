/*
 * Copyright (C) 2014  Brian Muramatsu
 *
 * This file is part of blockcillin.
 *
 * blockcillin is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * blockcillin is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with blockcillin.  If not, see <http://www.gnu.org/licenses/>.
 */

var BC = (function(root) {

	var parent = root.Audio = root.Audio || {};
	var me = parent.Player = parent.Player || {};

	me.make = function() {
		var context;
		var buffer;

		// Fix up prefixing of AudioContext.
		window.AudioContext = window.AudioContext || window.webkitAudioContext;

		// Create context and load sounds if the constructor is available.
		if (window.AudioContext) {
			context = new AudioContext();
			loadFile("audio/sounds.ogg");
		}

		function loadFile(url) {
			var request = new XMLHttpRequest();
			request.open("GET", url, true);
			request.responseType = "arraybuffer";

			request.onload = function() {
				function onDecodeSuccess(newBuffer) {
					buffer = newBuffer;
				}

				function onDecodeError() {
					BC.Log.error("error decoding data for " + url);
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