var BC = (function(parent) {

	var my = parent.Selector = parent.Selector || {}

	my.make = function() {
		var Direction = BC.Constants.Direction;

		var maxSelectorMovementTime = 0.05;

		var selector = {
			matrix: BC.Matrix.identity,
			move: move,
			update: update,
		};

		var direction = Direction.NONE;
		var translation = [0, 0, 0];
		var elapsedMovementTime = 0;

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
			if (!isMoving()) {
				startMoving(Direction.LEFT);
				return true;
			}
			return false;
		}

		function moveRight() {
			if (!isMoving()) {
				startMoving(Direction.RIGHT);
				return true;
			}
			return false;
		}

		function moveUp() {
			if (!isMoving()) {
				startMoving(Direction.UP);
				return true;
			}
			return false;
		}

		function moveDown() {
			if (!isMoving()) {
				startMoving(Direction.DOWN);
				return true;
			}
			return false;
		}

		function isMoving() {
			return direction !== Direction.NONE;
		}

		function startMoving(newDirection) {
			direction = newDirection;
			elapsedMovementTime = 0;
		}

		function update(deltaTime, now, ringTranslationY, ringRotationY, boardRotation) {
			if (isMoving()) {
				if (elapsedMovementTime + deltaTime > maxSelectorMovementTime) {
					deltaTime = maxSelectorMovementTime - elapsedMovementTime;
				}

				var translationDelta = deltaTime * ringTranslationY / maxSelectorMovementTime;
				var rotationDelta = deltaTime * ringRotationY / maxSelectorMovementTime;

				switch (direction) {
					case Direction.UP:
						translation[1] += translationDelta;
						break;

					case Direction.DOWN:
						translation[1] -= translationDelta;
						break;

					case Direction.LEFT:
						boardRotation[1] += rotationDelta;
						break;

					case Direction.RIGHT:
						boardRotation[1] -= rotationDelta;
						break;
				}

				elapsedMovementTime += deltaTime;
				if (elapsedMovementTime >= maxSelectorMovementTime) {
					direction = Direction.NONE;
					elapsedMovementTime = 0;
				}
			}

			var scale = 1 + Math.abs(Math.sin(4 * now)) / 25;
			var scaleMatrix = BC.Matrix.makeScale(scale, scale, 1);
			var translationMatrix = BC.Matrix.makeTranslation(
					translation[0],
					translation[1],
					translation[2]);
			selector.matrix = BC.Matrix.matrixMultiply(scaleMatrix, translationMatrix);
		}

		return selector;
	};

	return parent;

}(BC || {}))