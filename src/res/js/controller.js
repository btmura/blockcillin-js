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

	var me = root.Controller = root.Controller || {};

	me.Key = {
		UP: "UP",
		DOWN: "DOWN",
		LEFT: "LEFT",
		RIGHT: "RIGHT",
		PRIMARY_ACTION: "PRIMARY_ACTION",
		SECONDARY_ACTION: "SECONDARY_ACTION",
		MENU_ACTION: "MENU_ACTION"
	};

	me.make = function(args) {
		var Key = BC.Controller.Key;

		var TOUCH_THRESHOLD = 20;

		var storage = args.storage;
		var canvas = args.canvas;

		var moveLeftCallback = function() {};
		var moveRightCallback = function() {};
		var moveUpCallback = function() {};
		var moveDownCallback = function() {};
		var primaryActionCallback = function() {};
		var secondaryActionCallback = function() {};
		var menuActionCallback = function() {};
		var keyCodeAssignmentCallback = function() {};

		var touchStartX = 0;
		var touchStartY = 0;

		var assignKey;
		var keyData = {};

		keyData[Key.UP] = newKey("bc.controller.up", 38);
		keyData[Key.DOWN] = newKey("bc.controller.down", 40);
		keyData[Key.LEFT] = newKey("bc.controller.left", 37);
		keyData[Key.RIGHT] = newKey("bc.controller.right", 39);
		keyData[Key.PRIMARY_ACTION] = newKey("bc.controller.primaryAction", 32);
		keyData[Key.SECONDARY_ACTION] = newKey("bc.controller.secondaryAction", 17);
		keyData[Key.MENU_ACTION] = newKey("bc.controller.menuAction", 27);

		function newKey(storageKey, defaultKeyCode) {
			var initKeyCode = parseInt(storage.get(storageKey), 10) || defaultKeyCode;
			return {
				storageKey: storageKey,
				keyCode: initKeyCode
			};
		}

		$(document).keydown(function(event) {
			if (assignKey != null) {
				finishKeyCodeAssignment(event.keyCode);
				return false;
			}

			switch (event.keyCode) {
				case getKeyCode(Key.LEFT):
					moveLeftCallback.call();
					break;

				case getKeyCode(Key.RIGHT):
					moveRightCallback.call();
					break;

				case getKeyCode(Key.UP):
					moveUpCallback.call();
					break;

				case getKeyCode(Key.DOWN):
					moveDownCallback.call();
					break;

				case getKeyCode(Key.PRIMARY_ACTION):
					primaryActionCallback.call();
					break;

				case getKeyCode(Key.SECONDARY_ACTION):
					secondaryActionCallback.call();
					break;

				case getKeyCode(Key.MENU_ACTION):
					menuActionCallback.call();
					break;

				default:
					console.log(event.keyCode);
					break;
			}
			return false;
		});

		function finishKeyCodeAssignment(newKeyCode) {
			var oldKeyCode = getKeyCode(assignKey);
			var conflictingKey = getConflictingKey(assignKey, newKeyCode);
			if (conflictingKey) {
				setKeyCode(conflictingKey, oldKeyCode);
			}
			setKeyCode(assignKey, newKeyCode);
			cancelKeyCodeAssignment();
		}

		function getConflictingKey(avoidKey, newKeyCode) {
			for (var key in keyData) {
				if (keyData.hasOwnProperty(key)) {
					if (key !== avoidKey && keyData[key].keyCode === newKeyCode) {
						return key;
					}
				}
			}
			return null;
		}

		function getKeyCode(key) {
			return keyData[key].keyCode;
		}

		function setKeyCode(key, keyCode) {
			keyData[key].keyCode = keyCode;
			storage.set(keyData[key].storageKey, keyCode);
			keyCodeAssignmentCallback(key, keyCode);
		}

		$(canvas).on("touchstart touchmove touchend", function(event) {
			var touch = event.originalEvent.changedTouches[0];
			switch (event.type) {
				case "touchstart":
					touchStartX = touch.pageX;
					touchStartY = touch.pageY;
					break;

				case "touchend":
					var deltaX = touch.pageX - touchStartX;
					var deltaY = touch.pageY - touchStartY;

					var absDeltaX = Math.abs(deltaX);
					var absDeltaY = Math.abs(deltaY);

					function tryVerticalMove() {
						if (absDeltaY > TOUCH_THRESHOLD) {
							if (deltaY > 0) {
								moveDownCallback.call();
							} else {
								moveUpCallback.call();
							}
							return true;
						}
						return false;
					}

					function tryHorizontalMove() {
						if (absDeltaX > TOUCH_THRESHOLD) {
							if (deltaX > 0) {
								moveLeftCallback.call();
							} else {
								moveRightCallback.call();
							}
							return true;
						}
						return false;
					}

					if (absDeltaX > absDeltaY) {
						if (tryHorizontalMove() || tryVerticalMove()) {
							return false;
						}
					} else {
						if (tryVerticalMove() || tryHorizontalMove()) {
							return false;
						}
					}

					primaryActionCallback.call();
					break;
			}
			return false;
		});

		function setMoveLeftListener(callback) {
			moveLeftCallback = callback;
		}

		function setMoveRightListener(callback) {
			moveRightCallback = callback;
		}

		function setMoveUpListener(callback) {
			moveUpCallback = callback;
		}

		function setMoveDownListener(callback) {
			moveDownCallback = callback;
		}

		function setPrimaryActionListener(callback) {
			primaryActionCallback = callback;
		}

		function setSecondaryActionListener(callback) {
			secondaryActionCallback = callback;
		}

		function setMenuActionListener(callback) {
			menuActionCallback = callback;
		}

		function setKeyCodeAssignmentListener(callback) {
			keyCodeAssignmentCallback = callback;
		}

		function startKeyCodeAssignment(key) {
			assignKey = key;
		}

		function cancelKeyCodeAssignment() {
			assignKey = null;
		}

		return {
			setMoveLeftListener: setMoveLeftListener,
			setMoveRightListener: setMoveRightListener,
			setMoveUpListener: setMoveUpListener,
			setMoveDownListener: setMoveDownListener,
			setPrimaryActionListener: setPrimaryActionListener,
			setSecondaryActionListener: setSecondaryActionListener,
			setMenuActionListener: setMenuActionListener,
			setKeyCodeAssignmentListener: setKeyCodeAssignmentListener,
			startKeyCodeAssignment: startKeyCodeAssignment,
			cancelKeyCodeAssignment: cancelKeyCodeAssignment,
			getKeyCode: getKeyCode
		};
	};

	return root;

}(BC || {}))