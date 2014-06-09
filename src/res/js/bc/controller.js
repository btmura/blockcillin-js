var BC = (function(root) {

	var me = root.Controller = root.Controller || {};

	me.Key = {
		UP: "0",
		DOWN: "1",
		LEFT: "2",
		RIGHT: "3",
		PRIMARY_ACTION: "4",
		MENU_ACTION: "5"
	};

	me.make = function(canvas) {
		var Key = BC.Controller.Key;

		var TOUCH_THRESHOLD = 20;

		var moveLeftCallback = function() {};
		var moveRightCallback = function() {};
		var moveUpCallback = function() {};
		var moveDownCallback = function() {};
		var primaryActionCallback = function() {};
		var menuActionCallback = function() {};
		var keyCodeAssignmentCallback = function() {};

		var touchStartX = 0;
		var touchStartY = 0;

		var storage = localStorage || {};
		var assignKey;
		var keyData = {};

		keyData[Key.UP] = newKey("bc.controller.up", 38);
		keyData[Key.DOWN] = newKey("bc.controller.down", 40);
		keyData[Key.LEFT] = newKey("bc.controller.left", 37);
		keyData[Key.RIGHT] = newKey("bc.controller.right", 39);
		keyData[Key.PRIMARY_ACTION] = newKey("bc.controller.primaryAction", 32);
		keyData[Key.MENU_ACTION] = newKey("bc.controller.menuAction", 27);

		function newKey(storageKey, defaultKeyCode) {
			var initKeyCode = parseInt(storage[storageKey], 10) || defaultKeyCode;
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
			storage[keyData[key].storageKey] = keyCode;
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
			setMenuActionListener: setMenuActionListener,
			setKeyCodeAssignmentListener: setKeyCodeAssignmentListener,
			startKeyCodeAssignment: startKeyCodeAssignment,
			cancelKeyCodeAssignment: cancelKeyCodeAssignment,
			getKeyCode: getKeyCode
		};
	};

	return root;

}(BC || {}))