var BC = (function(parent) {

	var my = parent.Selector = parent.Selector || {}

	my.make = function() {
		var Direction = BC.Constants.Direction;

		var maxSelectorMovementTime = 0.05;

		var selector = {
			matrix: BC.Matrix.identity,

			move: move,
			update: update,

			// private details
			direction: Direction.NONE,
			elapsedMovementTime: 0,
			translation: [0, 0, 0]
		};

		function move(direction) {
			switch (direction) {
				case Direction.LEFT:
					return moveLeft();

				case Direction.RIGHT:
					return moveRight();

				case Direction.UP:
					return moveUp();

				case Direction.DOWN:
					return moveDown();
			}
		}

		function moveLeft() {
			if (selector.direction === Direction.NONE) {
				startMoving(Direction.LEFT);
				return true;
			}
			return false;
		}

		function moveRight() {
			if (selector.direction === Direction.NONE) {
				startMoving(Direction.RIGHT);
				return true;
			}
			return false;
		}

		function moveUp() {
			if (selector.direction === Direction.NONE) {
				startMoving(Direction.UP);
				return true;
			}
			return false;
		}

		function moveDown() {
			if (selector.direction === Direction.NONE) {
				startMoving(Direction.DOWN);
				return true;
			}
			return false;
		}

		function startMoving(direction) {
			selector.direction = direction;
			selector.elapsedMovementTime = 0;
		}

		function update(deltaTime, now, ringTranslationY, ringRotationY, boardRotation) {
			if (selector.direction !== Direction.NONE) {
				if (selector.elapsedMovementTime + deltaTime > maxSelectorMovementTime) {
					deltaTime = maxSelectorMovementTime - selector.elapsedMovementTime;
				}

				var translationDelta = deltaTime * ringTranslationY / maxSelectorMovementTime;
				var rotationDelta = deltaTime * ringRotationY / maxSelectorMovementTime;

				switch (selector.direction) {
					case Direction.UP:
						selector.translation[1] += translationDelta;
						break;

					case Direction.DOWN:
						selector.translation[1] -= translationDelta;
						break;

					case Direction.LEFT:
						boardRotation[1] += rotationDelta;
						break;

					case Direction.RIGHT:
						boardRotation[1] -= rotationDelta;
						break;
				}

				selector.elapsedMovementTime += deltaTime;
				if (selector.elapsedMovementTime >= maxSelectorMovementTime) {
					selector.direction = Direction.NONE;
					selector.elapsedMovementTime = 0;
				}
			}

			var scale = 1 + Math.abs(Math.sin(4 * now)) / 25;
			var scaleMatrix = BC.Matrix.makeScale(scale, scale, 1);
			var translationMatrix = BC.Matrix.makeTranslation(
					selector.translation[0],
					selector.translation[1],
					selector.translation[2]);
			selector.matrix = BC.Matrix.matrixMultiply(scaleMatrix, translationMatrix);
		}

		return selector;
	};

	return parent;

}(BC || {}))