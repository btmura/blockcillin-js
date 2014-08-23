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

	var me = root.Animation2 = root.Animation2 || {};

	me.make = function(args) {
		var numUpdates = args.numUpdates;
		var startCallback = args.startCallback || function() {};
		var updateCallback = args.updateCallback || function() {return false;};
		var finishCallback = args.finishCallback || function() {};

		var started = false;
		var done = false;

		var currentUpdate = 0;

		function update() {
			if (!started) {
				started = true;
				startCallback();
			}

			var result = updateCallback(currentUpdate);
			currentUpdate++;

			if (currentUpdate === numUpdates) {
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

	me.process = function(animations) {
		var changed = false;
		if (animations.length > 0) {
			var currentAnimation = animations[0];
			changed |= currentAnimation.update();
			if (currentAnimation.isDone()) {
				animations.shift();
			}
		}
		return changed;
	};

	return root;

}(BC || {}));