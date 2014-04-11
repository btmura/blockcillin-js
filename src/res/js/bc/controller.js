var BC = (function(parent) {

	var my = parent.Controller = parent.Controller || {}

	my.make = function(canvas) {
		var moveLeftCallback = function() {};
		var moveRightCallback = function() {};
		var moveUpCallback = function() {};
		var moveDownCallback = function() {};
		var primaryActionCallback = function() {};

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

		$(document).keydown(function(event) {
			switch (event.keyCode) {
				case 32: // space
					primaryActionCallback.call();
					break;

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
			}
			return false;
		});

		var touchThreshold = 50;
		var touchStartX = 0;
		var touchStartY = 0;

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

					if (deltaX > touchThreshold) {
						moveLeftCallback.call();
					} else if (deltaX < -touchThreshold) {
						moveRightCallback.call();
					} else if (deltaY > touchThreshold) {
						moveDownCallback.call();
					} else if (deltaY < -touchThreshold) {
						moveUpCallback.call();
					} else {
						primaryActionCallback.call();
					}
					break;
			}
			return false;
		});

		return {
			setMoveLeftListener: setMoveLeft,
			setMoveRightListener: setMoveRight,
			setMoveUpListener: setMoveUp,
			setMoveDownListener: setMoveDown,
			setPrimaryActionListener: setPrimaryAction
		};
	};

	return parent;

}(BC || {}))