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

	var me = root.Animation = root.Animation || {};

	me.make = function(args) {
		var duration = args.duration;
		var startCallback = args.startCallback || function() {};
		var updateCallback = args.updateCallback || function() {return false;};
		var finishCallback = args.finishCallback || function() {};

		var elapsedTime = 0;
		var started = false;
		var done = false;

		function update(watch) {
			if (!started) {
				started = true;
				startCallback();
			}

			var deltaTime = watch.deltaTime;
			if (elapsedTime + deltaTime > duration) {
				deltaTime = duration - elapsedTime;
			}
			elapsedTime += deltaTime;

			var result = updateCallback({
				now: watch.now,
				deltaTime: deltaTime,
				elapsedPercent: elapsedTime / duration,
				deltaPercent: deltaTime / duration
			});

			if (elapsedTime >= duration) {
				done = true;
				finishCallback();
			}

			return result;
		}

		function isDone() {
			return done;
		}

		return {
			update: update,
			isDone: isDone
		};
	};

	me.process = function(animations, watch) {
		var changed = false;
		if (animations.length > 0) {
			var currentAnimation = animations[0];
			changed |= currentAnimation.update(watch);
			if (currentAnimation.isDone()) {
				animations.shift();
			}
		}
		return changed;
	};

	return root;

}(BC || {}));