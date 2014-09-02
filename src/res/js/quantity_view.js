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

	var parent = root.Quantity = root.Quantity || {};
	var me = parent.View = parent.View || {};

	var displayFuncs;

	me.make = function(element) {
		if (!displayFuncs) {
			var Unit = BC.Unit;
			displayFuncs = {};
			displayFuncs[Unit.NONE] = function(value) {
				return value;
			};
			displayFuncs[Unit.SECONDS] = function(value) {
				var hours = Math.floor(value / 3600);
				value -= hours * 3600;

				var minutes = Math.floor(value / 60);
				value -= minutes * 60;

				var seconds = Math.floor(value);

				if (hours < 10) {
					hours = "0" + hours;
				}
				if (minutes < 10) {
					minutes = "0" + minutes;
				}
				if (seconds < 10) {
					seconds = "0" + seconds;
				}

				return hours + ":" + minutes + ":" + seconds;
			};
		}

		var previousValue;
		var previousUnit;

		function draw(quantity) {
			if (previousValue !== quantity.value || previousUnit !== quantity.unit) {
				previousValue = quantity.value;
				previousUnit = quantity.unit;

				var func = displayFuncs[quantity.unit];
				var newText = func(quantity.value);
				element.text(newText);
			}
		}

		return {
			draw: draw
		};
	};

	return root;

}(BC || {}))