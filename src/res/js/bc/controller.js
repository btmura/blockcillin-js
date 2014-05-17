var BC = (function(parent) {

	var my = parent.Controller = parent.Controller || {}

	my.make = function(canvas) {
		var TOUCH_THRESHOLD = 20;

		var touchStartX = 0;
		var touchStartY = 0;

		var moveLeftCallback = function() {};
		var moveRightCallback = function() {};
		var moveUpCallback = function() {};
		var moveDownCallback = function() {};
		var primaryActionCallback = function() {};
		var menuActionCallback = function() {};

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
			switch (event.keyCode) {
				case 37: // left
					moveLeftCallback.call();
					break;

				case 39: // right
					moveRightCallback.call();
					break;

				case 38: // up
					moveUpCallback.call();
					break;

				case 40: // down
					moveDownCallback.call();
					break;

				case 32: // space
					primaryActionCallback.call();
					break;

				case 27: // esc
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

		return {
			setMoveLeftListener: setMoveLeft,
			setMoveRightListener: setMoveRight,
			setMoveUpListener: setMoveUp,
			setMoveDownListener: setMoveDown,
			setPrimaryActionListener: setPrimaryAction,
			setMenuActionListener: setMenuAction
		};
	};

	return parent;

}(BC || {}))