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

	var parent = root.Menu = root.Menu || {};
	var me = parent.Options = parent.Options || {};

	me.make = function(args) {
		var Key = BC.Controller.Key;

		var KEY_CODE_TEXT = {
			8: "Backspace",
			9: "Tab",
			13: "Enter",
			16: "Shift",
			17: "Ctrl",
			18: "Alt",
			19: "Pause/Break",
			20: "Caps Lock",
			27: "Esc",
			32: "Space",
			33: "Page Up",
			34: "Page Down",
			35: "End",
			36: "Home",
			37: "Left",
			38: "Up",
			39: "Right",
			40: "Down",
			45: "Insert",
			46: "Delete",
			48: "0",
			49: "1",
			50: "2",
			51: "3",
			52: "4",
			53: "5",
			54: "6",
			55: "7",
			56: "8",
			57: "9",
			65: "A",
			66: "B",
			67: "C",
			68: "D",
			69: "E",
			70: "F",
			71: "G",
			72: "H",
			73: "I",
			74: "J",
			75: "K",
			76: "L",
			77: "M",
			78: "N",
			79: "O",
			80: "P",
			81: "Q",
			82: "R",
			83: "S",
			84: "T",
			85: "U",
			86: "V",
			87: "W",
			88: "X",
			89: "Y",
			90: "Z",
			91: "Windows",
			93: "Right Click",
			96: "Numpad 0",
			97: "Numpad 1",
			98: "Numpad 2",
			99: "Numpad 3",
			100: "Numpad 4",
			101: "Numpad 5",
			102: "Numpad 6",
			103: "Numpad 7",
			104: "Numpad 8",
			105: "Numpad 9",
			106: "Numpad *",
			107: "Numpad +",
			109: "Numpad -",
			110: "Numpad .",
			111: "Numpad /",
			112: "F1",
			113: "F2",
			114: "F3",
			115: "F4",
			116: "F5",
			117: "F6",
			118: "F7",
			119: "F8",
			120: "F9",
			121: "F10",
			122: "F11",
			123: "F12",
			144: "Num Lock",
			145: "Scroll Lock",
			182: "My Computer",
			183: "My Calculator",
			186: ";",
			187: "=",
			188: ",",
			189: "-",
			190: ".",
			191: "/",
			192: "`",
			219: "[",
			220: "\\",
			221: "]",
			222: "'"
		};

		var ASSIGN_KEY_BUTTON_TEXT = "PRESS KEY";
		var MENU_FADE_SPEED = "slow";

		var controller = args.controller;

		var keyButtonMap = {};

		var menu = $("#options-menu");
		var upButton = newKeyButton("#up-button", menu, Key.UP);
		var downButton = newKeyButton("#down-button", menu, Key.DOWN);
		var leftButton = newKeyButton("#left-button", menu, Key.LEFT);
		var rightButton = newKeyButton("#right-button", menu, Key.RIGHT);
		var swapButton = newKeyButton("#swap-button", menu, Key.PRIMARY_ACTION);
		var raiseButton = newKeyButton("#raise-button", menu, Key.SECONDARY_ACTION);
		var menuButton = newKeyButton("#menu-button", menu, Key.MENU_ACTION);
		var closeButton = $("#close-button", menu);

		function newKeyButton(id, menu, key) {
			var button = $(id, menu);
			keyButtonMap[key] = button;
			button.click(function() {
				button.text(ASSIGN_KEY_BUTTON_TEXT);
				controller.startKeyCodeAssignment(key);
			});
			return button;
		}

		closeButton.click(function() {
			hide();
		});

		controller.setKeyCodeAssignmentListener(function(key, keyCode) {
			var button = keyButtonMap[key];
			setButtonKeyCodeText(button, keyCode);
		});

		function setButtonKeyCodeText(button, keyCode) {
			button.text(KEY_CODE_TEXT[keyCode] || "#" + keyCode);
		}

		function refreshButton(button, key) {
			setButtonKeyCodeText(button, controller.getKeyCode(key));
		}

		function show() {
			// TODO(btmura): use a map to make adding keys easier
			refreshButton(upButton, Key.UP);
			refreshButton(downButton, Key.DOWN);
			refreshButton(leftButton, Key.LEFT);
			refreshButton(rightButton, Key.RIGHT);
			refreshButton(swapButton, Key.PRIMARY_ACTION);
			refreshButton(raiseButton, Key.SECONDARY_ACTION);
			refreshButton(menuButton, Key.MENU_ACTION);

			menu.fadeIn(MENU_FADE_SPEED);
		}

		function hide() {
			controller.cancelKeyCodeAssignment();
			menu.fadeOut(MENU_FADE_SPEED);
		}

		return {
			show: show,
			hide: hide
		};
	};

	return root;

}(BC || {}))