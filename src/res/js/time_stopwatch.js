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

	var parent = root.Time = root.Time || {};
	var me = parent.Stopwatch = parent.Stopwatch || {};

	me.make = function(args) {
		var clock = args.clock;

		function getTimeInSeconds() {
			return clock.now() * 0.001;
		}

		var watch = {
			reset: reset,
			tick: tick
		};

		function reset() {
			watch.then = getTimeInSeconds();
		}

		function tick() {
			watch.now = getTimeInSeconds();
			watch.deltaTime = watch.now - watch.then;
			watch.then = watch.now;
		}

		reset();
		return watch;
	};

	return root;

}(BC || {}))
