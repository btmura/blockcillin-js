var BC = (function(parent) {

	var my = parent.Game = parent.Game || {}

	my.run = function() {
		var MENU_DURATION = "fast";

		var Direction = BC.Constants.Direction;

		var started = false;
		var paused = false;

		var gameMenu = $("#game-menu");
		var newGameButton = $("#new-game-button");
		var continueGameButton = $("#continue-game-button");

		var watch = BC.StopWatch.make();
		var board;
		var boardView;

		var canvas = document.getElementById("canvas");
		if (!canvas) {
			return;
		}

		var controller = BC.Controller.make(canvas);

		var gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
		if (!gl) {
			return;
		}

		// Set the 1 required texture to a 1x1 placeholder and then fire off
		// an async call to load the image while we do other things.
		var texture = gl.createTexture();
		gl.bindTexture(gl.TEXTURE_2D, texture);
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([0, 0, 0, 255]));

		var image = new Image();
		image.src = "images/textures.png";
		$(image).load(function() {
			gl.bindTexture(gl.TEXTURE_2D, texture);
			gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA,gl.UNSIGNED_BYTE, image);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
			gl.generateMipmap(gl.TEXTURE_2D);
		});

		gl.enable(gl.CULL_FACE);
		gl.enable(gl.DEPTH_TEST);

		gl.enable(gl.BLEND);
		gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

		var vertexShader = BC.GL.loadShader(gl, "vertex-shader", gl.VERTEX_SHADER);
		var fragmentShader = BC.GL.loadShader(gl, "fragment-shader", gl.FRAGMENT_SHADER);
		var program = BC.GL.createProgram(gl, [vertexShader, fragmentShader]);
		gl.useProgram(program);

		function getAttrib(name) {
			return gl.getAttribLocation(program, name);
		}

		function getUniform(name) {
			return gl.getUniformLocation(program, name);
		}

		var programLocations = {
			positionLocation: getAttrib("a_position"),
			textureCoordLocation: getAttrib("a_textureCoord"),

			projectionMatrixLocation: getUniform("u_projectionMatrix"),
			viewMatrixLocation: getUniform("u_viewMatrix"),

			boardRotationMatrixLocation: getUniform("u_boardRotationMatrix"),
			boardTranslationMatrixLocation: getUniform("u_boardTranslationMatrix"),
			selectorMatrixLocation: getUniform("u_selectorMatrix"),
			ringMatrixLocation: getUniform("u_ringMatrix"),
			cellMatrixLocation: getUniform("u_cellMatrix"),

			yellowBoostLocation: getUniform("u_yellowBoost"),
			alphaLocation: getUniform("u_alpha")
		};

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

		// Creates the view matrix.
		function makeViewMatrix() {
			var cameraPosition = [0, 0.1, 3];
			var targetPosition = [0, 0, 0];
			var up = [0, 1, 0];
			var cameraMatrix = BC.Matrix.makeLookAt(cameraPosition, targetPosition, up);
			return BC.Matrix.makeInverse(cameraMatrix);
		}

		// Create the initial view matrix. Doesn't need to be set again later.
		var viewMatrix = makeViewMatrix();
		gl.uniformMatrix4fv(programLocations.viewMatrixLocation, false, viewMatrix);

		newGameButton.click(function() {
			startGame();
		});

		continueGameButton.click(function() {
			resumeGame();
		});

		controller.setMenuActionListener(function() {
			if (!paused) {
				pauseGame();
			} else {
				resumeGame();
			}
		});

		showMainMenu(true);

		function startGame() {
			started = true;

			var metrics = {
				numRings: 3,
				numCells: 24,
				numBlockTypes: 6,
				ringInnerRadius: 0.75,
				ringOuterRadius: 1,
				ringHeight: 0.3
			};

			var resources = BC.Resources.make();

			board = BC.Board.make(metrics);
			boardView = BC.Board.View.make({
				board: board,
				gl: gl,
				programLocations: programLocations,
				resources: resources
			});

			controller.setMoveLeftListener(function() {
				board.move(Direction.LEFT);
			});
			controller.setMoveRightListener(function() {
				board.move(Direction.RIGHT);
			});
			controller.setMoveUpListener(function() {
				board.move(Direction.UP);
			});
			controller.setMoveDownListener(function() {
				board.move(Direction.DOWN);
			});
			controller.setPrimaryActionListener(function() {
				board.swap();
			});

			resumeGame();
		}

		function pauseGame() {
			paused = true;
			showMainMenu(true);
		}

		function resumeGame() {
			paused = false;
			showMainMenu(false);
			watch.reset();
			drawFrame();
		}

		function drawFrame() {
			gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
			gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
			gl.uniformMatrix4fv(programLocations.projectionMatrixLocation, false, projectionMatrix);

			watch.tick();

			board.update(watch);
			boardView.draw();

			if (!paused) {
				requestAnimationFrame(drawFrame);
			}
		}

		function showMainMenu(show) {
			if (show) {
				setVisible(continueGameButton, started);
				gameMenu.fadeIn(MENU_DURATION);
			} else {
				gameMenu.fadeOut(MENU_DURATION);
			}
		}

		function setVisible(element, show) {
			if (show) {
				element.show();
			} else {
				element.hide();
			}
		}
	}

	return parent;

}(BC || {}))

$(document).ready(function() {
	BC.Game.run();
});
