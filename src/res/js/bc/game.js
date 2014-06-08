var BC = (function(root) {

	var me = root.Game = root.Game || {};

	me.run = function() {
		var MAIN_MENU_GAME_TITLE = "b l o c k c i l l i n";
		var MAIN_MENU_PAUSED_TITLE = "P A U S E D";
		var MAIN_MENU_GAME_OVER_TITLE = "G A M E  O V E R";
		var MENU_DURATION = "slow";
		var FLICKER_DURATION = 20;

		var Direction = BC.Constants.Direction;
		var Sound = BC.Audio.Sound;

		var started = false;
		var paused = false;
		var gameOver = false;

		var mainMenu = $("#main-menu");
		var mainMenuTitle = $("#main-menu-title");
		var mainMenuStats = $("#main-menu-stats");

		var continueButton = $("#continue-button");
		var newGameButton = $("#new-game-button");
		var optionsButton = $("#options-button");

		var gameMenu = $("#game-menu");
		var pauseButton = $("#pause-button");

		var buttons = $(".button");

		var metrics = {
			numRings: 3,
			numCells: 24,
			numBlockTypes: 6,
			ringInnerRadius: 0.75,
			ringOuterRadius: 1,
			ringHeight: 0.3
		};
		var resources = BC.Resources.make();
		var watch = BC.StopWatch.make();
		var audioPlayer = BC.Audio.Player.make();

		var mainMenuSpeedLevelView = BC.Stat.View.make("#main-menu-speed-level-stat");
		var mainMenuElapsedTimeView = BC.Stat.View.make("#main-menu-elapsed-time-stat");
		var mainMenuScoreView = BC.Stat.View.make("#main-menu-score-stat");

		var board;
		var boardView;

		var canvas = document.getElementById("canvas");
		if (!canvas) {
			return;
		}

		var controller = BC.Controller.make(canvas);
		var optionsMenu = BC.Menu.Options.make({
			controller: controller
		});

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
				drawFrame();
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

		buttons.click(function(event) {
			audioPlayer.play(Sound.BUTTON_CLICK);
			flicker($(event.target));
		});

		buttons.mouseenter(function() {
			audioPlayer.play(Sound.BUTTON_HOVER);
		});

		showMainMenu(true);

		newGameButton.click(function() {
			startGame();
		});

		continueButton.click(function() {
			resumeGame();
		});

		pauseButton.click(function() {
			pauseGame();
		});

		optionsButton.click(function() {
			setVisible(optionsMenu, true);
		});

		controller.setMenuActionListener(function() {
			if (!paused) {
				pauseGame();
			} else {
				resumeGame();
			}
		});

		document.addEventListener("visibilitychange", function() {
			if (document.hidden) {
				pauseGame();
			}
		});

		function startGame() {
			started = true;
			gameOver = false;

			board = BC.Board.make({
				metrics: metrics,
				audioPlayer: audioPlayer
			});
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

		// Update the game's state if there is an active game.
		// Always draws the game board for when the window is resized.
		function drawFrame() {
			gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
			gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
			gl.uniformMatrix4fv(programLocations.projectionMatrixLocation, false, projectionMatrix);

			// Check whether there is a game in progress.
			var activeGame = !paused && !gameOver && board;

			// Update the game's state only if theres an active game.
			if (activeGame) {
				watch.tick();
				gameOver = board.update(watch);
			}

			// Always draw the board since this may be just a resize event.
			if (boardView) {
				boardView.draw();
			}

			// Request another frame if there is an active game.
			// Repeated requests shouldn't be an issue.
			if (activeGame) {
				requestAnimationFrame(drawFrame);
			}

			// Show the menu when the game is over.
			// Showing the main menu if it is already visible should be OK.
			if (gameOver) {
				started = false;
				paused = false;
				showMainMenu(true);
			}
		}

		function showMainMenu(show) {
			if (show) {
				mainMenuTitle.text(getMainMenuTitle());
				showMainMenuStats(started || gameOver);
				setVisible(continueButton, started);
				mainMenu.fadeIn(MENU_DURATION);
				gameMenu.fadeOut(MENU_DURATION);
			} else {
				mainMenu.fadeOut(MENU_DURATION);
				gameMenu.fadeIn(MENU_DURATION);
			}
		}

		function getMainMenuTitle() {
			if (gameOver) {
				return MAIN_MENU_GAME_OVER_TITLE;
			} else if (started && paused) {
				return MAIN_MENU_PAUSED_TITLE;
			} else {
				return MAIN_MENU_GAME_TITLE;
			}
		}

		function showMainMenuStats(show) {
			// Update stats only on display and leave them the same as the menu fades out.
			if (show) {
				mainMenuSpeedLevelView.draw(board.speedLevel);
				mainMenuScoreView.draw(board.score);
				mainMenuElapsedTimeView.draw(board.elapsedTime);
			}
			setVisible(mainMenuStats, show);
		}

		function flicker(element) {
			element.fadeIn(FLICKER_DURATION)
				.fadeOut(FLICKER_DURATION)
				.fadeIn(FLICKER_DURATION)
				.fadeOut(FLICKER_DURATION)
				.fadeIn(FLICKER_DURATION);
		}

		function setVisible(element, show) {
			if (show) {
				element.show();
			} else {
				element.hide();
			}
		}
	}

	return root;

}(BC || {}))

$(document).ready(function() {
	BC.Game.run();
});
