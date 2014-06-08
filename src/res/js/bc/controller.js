var BC = (function(root) {

	var me = root.Controller = root.Controller || {};

	me.Key = {
		UP: 0,
		DOWN: 1,
		LEFT: 2,
		RIGHT: 3,
		PRIMARY_ACTION: 4,
		MENU_ACTION: 5
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

		var storageKeyMap = {};
		var keyCodeMap = {};

		var assignKey;
		var assignCallback;

		var touchStartX = 0;
		var touchStartY = 0;

		function initKey(key, storageKey, defaultKeyCode) {
			storageKeyMap[key] = storageKey;
			keyCodeMap[key] = localStorage[storageKey] || defaultKeyCode;
		}

		initKey(Key.UP, "up", 38);
		initKey(Key.DOWN, "down", 40);
		initKey(Key.LEFT, "left", 37);
		initKey(Key.RIGHT, "right", 39);
		initKey(Key.PRIMARY_ACTION, "primaryAction", 32);
		initKey(Key.MENU_ACTION, "menuAction", 27);

		function setMoveLeft(callback) {
			moveLeftCallback = callback;
		}

		function setMoveRight(callback) {
			moveRightCallback = callback;
		}

		function setMoveUp(callback) {
			moveUpCallback = callback;
		}

		function setMoveDown(callback) {
			moveDownCallback = callback;
		}

		function setPrimaryAction(callback) {
			primaryActionCallback = callback;
		}

		function setMenuAction(callback) {
			menuActionCallback = callback;
		}

		$(document).keydown(function(event) {
			if (assignKey != null) {
				keyCodeMap[assignKey] = event.keyCode;
				localStorage[storageKeyMap[assignKey]] = event.keyCode;
				assignKey = null;
				assignCallback.call(null, event.keyCode);
				return false;
			}

			switch (event.keyCode) {
				case keyCodeMap[Key.LEFT]:
					moveLeftCallback.call();
					break;

				case keyCodeMap[Key.RIGHT]:
					moveRightCallback.call();
					break;

				case keyCodeMap[Key.UP]:
					moveUpCallback.call();
					break;

				case keyCodeMap[Key.DOWN]:
					moveDownCallback.call();
					break;

				case keyCodeMap[Key.PRIMARY_ACTION]:
					primaryActionCallback.call();
					break;

				case keyCodeMap[Key.MENU_ACTION]:
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

		function assign(key, callback) {
			assignKey = key;
			assignCallback = callback;
		}

		function getKeyCode(key) {
			return keyCodeMap[key];
		}

		return {
			setMoveLeftListener: setMoveLeft,
			setMoveRightListener: setMoveRight,
			setMoveUpListener: setMoveUp,
			setMoveDownListener: setMoveDown,
			setPrimaryActionListener: setPrimaryAction,
			setMenuActionListener: setMenuAction,
			assign: assign,
			getKeyCode: getKeyCode
		};
	};

	return root;

}(BC || {}))