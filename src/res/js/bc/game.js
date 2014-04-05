var BC = (function(parent) {

	var my = parent.Game = parent.Game || {}

	my.run = function() {
		var canvas = document.getElementById("canvas");
		if (!canvas) {
			return;
		}

		var gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
		if (!gl) {
			return;
		}

		gl.enable(gl.CULL_FACE);
		gl.enable(gl.DEPTH_TEST);
		gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

		var vertexShader = BC.GL.loadShader(gl, 'vertex-shader', gl.VERTEX_SHADER);
		var fragmentShader = BC.GL.loadShader(gl, 'fragment-shader', gl.FRAGMENT_SHADER);
		var program = BC.GL.createProgram(gl, [vertexShader, fragmentShader]);
		gl.useProgram(program);

		var positionLocation = gl.getAttribLocation(program, "a_position");
		var textureCoordLocation = gl.getAttribLocation(program, "a_texcoord");
		var projectionMatrixLocation = gl.getUniformLocation(program, "u_projectionMatrix");
		var viewMatrixLocation = gl.getUniformLocation(program, "u_viewMatrix");
		var matrixLocation = gl.getUniformLocation(program, "u_matrix");

		var then = BC.Time.getTimeInSeconds();

		var up = [0, 1, 0];
		var cameraPosition = [0, 0.75, 2];
		var targetPosition = [0, 0, 0];
		var cameraMatrix = BC.Matrix.makeLookAt(cameraPosition, targetPosition, up);
		var viewMatrix = BC.Matrix.makeInverse(cameraMatrix);

		var texture = gl.createTexture();
		gl.bindTexture(gl.TEXTURE_2D, texture);

		// Fill the texture with a 1x1 black pixel.
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([0, 0, 0, 255]));

		var image = new Image();
		image.src = "images/textures.png";
		$(image).load(function() {
			gl.bindTexture(gl.TEXTURE_2D, texture);
			gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA,gl.UNSIGNED_BYTE, image);
			gl.generateMipmap(gl.TEXTURE_2D);
		});

		// Sets the canvas's width and height to the size it's being displayed at.
		function resizeCanvas() {
			// Compare current dimensions to displayed dimensions and set them if different.
			if (canvas.width != canvas.clientWidth || canvas.height != canvas.clientHeight) {
				canvas.width = canvas.clientWidth;
				canvas.height = canvas.clientHeight;
				return true;
			}
			return false;
		}

		// Initially resize the canvas since setting the width to 100% width just scales.
		resizeCanvas();

		// Creates the projection matrix based upon the current canvas dimensions.
		function makeProjectionMatrix() {
			var aspect = canvas.width / canvas.height;
			var fieldOfViewRadians = BC.Math.radians(90);
			return BC.Matrix.makePerspective(fieldOfViewRadians, aspect, 1, 2000);
		}

		// Create the inital projection matrix.
		var projectionMatrix = makeProjectionMatrix();

		// Set a window resize event listener to adjust the canvas and projection matrix.
		$(window).resize(function() {
			if (resizeCanvas()) {
				projectionMatrix = makeProjectionMatrix();
			}
		});

		var boardModel = BC.Board.makeModel({
			numRingCells: 24,
			numBlockStyles: 6,
		});

		var boardView = BC.Board.makeView(boardModel);

		var numSlices = 24;
		var innerRadius = 0.75;
		var outerRadius = 1;
		var maxY = 0.15;
		var minY = -0.15;

		var metrics = {
			numSlices: numSlices,
			innerRadius: innerRadius,
			outerRadius: outerRadius,
			maxY: maxY,
			minY: minY
		};

		var tileSet = BC.GL.textureTileSet(4, 4, 0.002);
		var ringTextureTiles = [
			tileSet.tile(0, 0),
			tileSet.tile(0, 1),
			tileSet.tile(0, 2),
			tileSet.tile(0, 3),
			tileSet.tile(1, 0),
			tileSet.tile(1, 1)
		];
		var selectorTextureTile = tileSet.tile(1, 2);

		var rings = [
			BC.Ring.makeRing(gl, metrics, ringTextureTiles),
			BC.Ring.makeRing(gl, metrics, ringTextureTiles),
			BC.Ring.makeRing(gl, metrics, ringTextureTiles)
		];
		var selector = BC.Selector.makeSelector(gl, metrics, selectorTextureTile);

		var Direction = {
			NONE : 0,
			UP : 1,
			DOWN: 2,
			LEFT: 3,
			RIGHT: 4
		};

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

					var direction = Direction.NONE;
					if (deltaX > touchThreshold) {
						direction = Direction.LEFT;
					} else if (deltaX < -touchThreshold) {
						direction = Direction.RIGHT;
					} else if (deltaY > touchThreshold) {
						direction = Direction.DOWN;
					} else if (deltaY < -touchThreshold) {
						direction = Direction.UP;
					}
					handleDirection(direction);
					break;
			}
			return false;
		});

		$(document).keydown(function(event) {
			var keyCodeDirectionMap = {
				37: Direction.LEFT,
				39: Direction.RIGHT,
				38: Direction.UP,
				40: Direction.DOWN
			};
			handleDirection(keyCodeDirectionMap[event.keyCode]);
			return false;
		});

		function handleDirection(direction) {
			switch (direction) {
				case Direction.LEFT:
					moveSelectorLeft();
					break;

				case Direction.RIGHT:
					moveSelectorRight();
					break;

				case Direction.UP:
					moveSelectorUp();
					break;

				case Direction.DOWN:
					moveSelectorDown();
					break;
			}
		}

		var selectorDirection = Direction.NONE;
		var currentSelectorMovementPeriod = 0;
		var maxSelectorMovementPeriod = 0.05;
		var currentRing = 0;

		function moveSelectorLeft() {
			if (selectorDirection === Direction.NONE) {
				selectorDirection = Direction.LEFT;
				currentSelectorMovementPeriod = 0;
			}
		}

		function moveSelectorRight() {
			if (selectorDirection === Direction.NONE) {
				selectorDirection = Direction.RIGHT;
				currentSelectorMovementPeriod = 0;
			}
		}

		function moveSelectorUp() {
			if (selectorDirection === Direction.NONE && currentRing > 0) {
				selectorDirection = Direction.UP;
				currentSelectorMovementPeriod = 0;
				currentRing--;
			}
		}

		function moveSelectorDown() {
			if (selectorDirection === Direction.NONE && currentRing + 1 < rings.length) {
				selectorDirection = Direction.DOWN;
				currentSelectorMovementPeriod = 0;
				currentRing++;
			}
		}

		var scaleMatrix = BC.Matrix.makeScale(1, 1, 1);

		var rotation = [0, 0, 0];
		var rotationXMatrix = BC.Matrix.makeXRotation(rotation[0]);
		var rotationYMatrix = BC.Matrix.makeYRotation(rotation[1]);
		var rotationZMatrix = BC.Matrix.makeZRotation(rotation[2]);

		var selectorTranslation = [0, 0, 0];

		var ringRotation = 2 * Math.PI / numSlices;
		var ringTranslation = maxY - minY;

		function drawScene() {
			gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
			gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

			var now = BC.Time.getTimeInSeconds();
			var deltaTime = now - then;
			then = now;

			gl.uniformMatrix4fv(projectionMatrixLocation, false, projectionMatrix);
			gl.uniformMatrix4fv(viewMatrixLocation, false, viewMatrix);

			if (selectorDirection !== Direction.NONE) {
				if (currentSelectorMovementPeriod + deltaTime > maxSelectorMovementPeriod) {
					deltaTime = maxSelectorMovementPeriod - currentSelectorMovementPeriod;
				}

				var verticalTranslation = deltaTime * ringTranslation / maxSelectorMovementPeriod;
				var horizontalRotation = deltaTime * ringRotation / maxSelectorMovementPeriod;

				switch (selectorDirection) {
					case Direction.UP:
						selectorTranslation[1] += verticalTranslation;
						break;

					case Direction.DOWN:
						selectorTranslation[1] -= verticalTranslation;
						break;

					case Direction.LEFT:
						rotation[1] += horizontalRotation;
						break;

					case Direction.RIGHT:
						rotation[1] -= horizontalRotation;
						break;
				}

				currentSelectorMovementPeriod += deltaTime;
				if (currentSelectorMovementPeriod >= maxSelectorMovementPeriod) {
					selectorDirection = Direction.NONE;
					currentSelectorMovementPeriod = 0;
				}
			}

			var rotationYMatrix = BC.Matrix.makeYRotation(rotation[1]);

			for (var i = 0; i < rings.length; i++) {
				var translationMatrix = BC.Matrix.makeTranslation(0, -i * ringTranslation, 0);

				var matrix = BC.Matrix.matrixMultiply(scaleMatrix, rotationZMatrix);
				matrix = BC.Matrix.matrixMultiply(matrix, rotationYMatrix);
				matrix = BC.Matrix.matrixMultiply(matrix, rotationXMatrix);
				matrix = BC.Matrix.matrixMultiply(matrix, translationMatrix);

				gl.uniformMatrix4fv(matrixLocation, false, matrix);
				rings[i].draw(positionLocation, textureCoordLocation);
			}

			var selectorScale = 1 + Math.abs(Math.sin(4 * now)) / 50;
			var selectorScaleMatrix = BC.Matrix.makeScale(selectorScale, selectorScale, 1);
			var selectorTranslationMatrix = BC.Matrix.makeTranslation(
					selectorTranslation[0],
					selectorTranslation[1],
					selectorTranslation[2]);
			var selectorMatrix = BC.Matrix.matrixMultiply(selectorScaleMatrix, selectorTranslationMatrix);
			gl.uniformMatrix4fv(matrixLocation, false, selectorMatrix);
			selector.draw(positionLocation, textureCoordLocation);

			boardView.draw();

			requestAnimationFrame(drawScene);
		}

		drawScene();
	}

	return parent;

}(BC || {}))

$(document).ready(function() {
	BC.Game.run();
});
