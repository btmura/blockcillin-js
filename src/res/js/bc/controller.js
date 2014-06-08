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
		var TOUCH_THRESHOLD = 20;

		var Key = BC.Controller.Key;

		var moveLeftCallback = function() {};
		var moveRightCallback = function() {};
		var moveUpCallback = function() {};
		var moveDownCallback = function() {};
		var primaryActionCallback = function() {};
		var menuActionCallback = function() {};

		var assignKey;
		var assignCallback;

		var touchStartX = 0;
		var touchStartY = 0;

		var storage = localStorage || {};
		var keyData = {};

		keyData[Key.UP] = newKey("bc.controller.up", 38);
		keyData[Key.DOWN] = newKey("bc.controller.down", 40);
		keyData[Key.LEFT] = newKey("bc.controller.left", 37);
		keyData[Key.RIGHT] = newKey("bc.controller.right", 39);
		keyData[Key.PRIMARY_ACTION] = newKey("bc.controller.primaryAction", 32);
		keyData[Key.MENU_ACTION] = newKey("bc.controller.menuAction", 27);

		function newKey(storageKey, defaultKeyCode) {
			var initKeyCode = parseInt(storage[storageKey], 10) || defaultKeyCode;

			var key = {
				storageKey: storageKey,
				keyCode: initKeyCode,
				setKeyCode: setKeyCode
			};

			function setKeyCode(newKeyCode) {
				key.keyCode = newKeyCode;
				storage[storageKey] = newKeyCode;
			}

			return key;
		}

		function isKeyCodeTaken(assignKey, newKeyCode) {
			for (var key in keyData) {
				if (keyData.hasOwnProperty(key)) {
					if (key !== assignKey && keyData[key].keyCode === newKeyCode) {
						return true;
					}
				}
			}
			return false;
		}

		$(document).keydown(function(event) {
			if (assignKey != null) {
				if (!isKeyCodeTaken(assignKey, event.keyCode)) {
					keyData[assignKey].setKeyCode(event.keyCode);
					assignCallback(event.keyCode);
					cancelKeyCodeAssignment();
				}
				return false;
			}

			switch (event.keyCode) {
				case keyData[Key.LEFT].keyCode:
					moveLeftCallback.call();
					break;

				case keyData[Key.RIGHT].keyCode:
					moveRightCallback.call();
					break;

				case keyData[Key.UP].keyCode:
					moveUpCallback.call();
					break;

				case keyData[Key.DOWN].keyCode:
					moveDownCallback.call();
					break;

				case keyData[Key.PRIMARY_ACTION].keyCode:
					primaryActionCallback.call();
					break;

				case keyData[Key.MENU_ACTION].keyCode:
					menuActionCallback.call();
					break;

				default:
					console.log(event.keyCode);
					break;
			}
			return false;
		});

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

		function startKeyCodeAssignment(key, callback) {
			assignKey = key;
			assignCallback = callback;
		}

		function cancelKeyCodeAssignment() {
			assignKey = null;
			assignCallback = null;
		}

		function getKeyCode(key) {
			return keyData[key].keyCode;
		}

		return {
			setMoveLeftListener: setMoveLeftListener,
			setMoveRightListener: setMoveRightListener,
			setMoveUpListener: setMoveUpListener,
			setMoveDownListener: setMoveDownListener,
			setPrimaryActionListener: setPrimaryActionListener,
			setMenuActionListener: setMenuActionListener,
			startKeyCodeAssignment: startKeyCodeAssignment,
			cancelKeyCodeAssignment: cancelKeyCodeAssignment,
			getKeyCode: getKeyCode
		};
	};

	return root;

}(BC || {}))