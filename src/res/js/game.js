/*
 * Copyright (C) 2014  Brian Muramatsu
 *
 * This file is part of blockcillin.
 *
 * blockcillin is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * blockcillin is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with blockcillin.  If not, see <http://www.gnu.org/licenses/>.
 */

var BC = (function(root) {

	var me = root.Game = root.Game || {};

	me.make = function(args) {
		var Clock = BC.Time.Clock;
		var Direction = BC.Direction;
		var GL = BC.GL;
		var Matrix = BC.Math.Matrix;
		var Stopwatch = BC.Time.Stopwatch;

		var gl = args.gl;
		var storage = args.storage;
		var controller = args.controller;
		var statBoard = args.statBoard;
		var audioPlayer = args.audioPlayer;
		var gmSpeedLevelView = args.gmSpeedLevelView;
		var gmElapsedTimeView = args.gmElapsedTimeView;
		var gmScoreView = args.gmScoreView;

		var started = false;
		var paused = false;
		var gameOver = false;

		var metrics = {
			numRings: 3,
			numCells: 24,
			numBlockTypes: 6,
			ringInnerRadius: 0.75,
			ringOuterRadius: 1,
			ringHeight: 0.3
		};
		var config = BC.Config.make();
		var resources = BC.Resources.make();
		var clock = Clock.make();
		var watch = Stopwatch.make({
			clock: clock
		});
		var lag = 0.0;

		var speedLevelStat;
		var elapsedTimeStat;
		var scoreStat;

		var board;
		var boardView;

		var resumeCallback = function() {};
		var pauseCallback = function() {};
		var gameOverCallback = function() {};

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

		var vertexShader = GL.loadShader(gl, "vertex-shader", gl.VERTEX_SHADER);
		var fragmentShader = GL.loadShader(gl, "fragment-shader", gl.FRAGMENT_SHADER);
		var program = GL.createProgram(gl, [vertexShader, fragmentShader]);
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
			return BC.Math.Matrix.makePerspective(fieldOfViewRadians, aspect, 1, 2000);
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
			var cameraMatrix = Matrix.makeLookAt(cameraPosition, targetPosition, up);
			return Matrix.makeInverse(cameraMatrix);
		}

		// Create the initial view matrix. Doesn't need to be set again later.
		var viewMatrix = makeViewMatrix();
		gl.uniformMatrix4fv(programLocations.viewMatrixLocation, false, viewMatrix);

		function startGame() {
			started = true;
			gameOver = false;

			board = BC.Board.make({
				metrics: metrics,
				config: config,
				audioPlayer: audioPlayer
			});
			boardView = BC.Board.View.make({
				board: board,
				gl: gl,
				programLocations: programLocations,
				resources: resources,
				speedLevelStatView: gmSpeedLevelView,
				elapsedTimeStatView: gmElapsedTimeView,
				scoreStatView: gmScoreView
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
			controller.setSecondaryActionListener(function() {
				board.raise();
			});

			resumeGame();
		}

		function pauseGame() {
			paused = true;
			pauseCallback();
		}

		function resumeGame() {
			paused = false;
			resumeCallback();
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
			var secondsPerUpdate = config.getSecondsPerUpdate();

			// Update the game's state only if theres an active game.
			if (activeGame) {
				watch.tick();

				lag += watch.deltaTime;
				for (var update = 0; lag >= secondsPerUpdate; update++) {
					var oldGameOver = gameOver;
					gameOver = board.update();
					lag -= secondsPerUpdate;
					if (oldGameOver !== gameOver) {
						addStats();
						break;
					}
				}
			}

			// Always draw the board since this may be just a resize event.
			if (boardView) {
				boardView.draw(lag / secondsPerUpdate);
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
				gameOverCallback();
			}
		}

		function addStats() {
			statBoard.addStats({
				speedLevel: board.speedLevel.value,
				elapsedTime: board.elapsedTime.value,
				score: board.score.value
			});
		}

		function isPaused() {
			return paused;
		}

		function isGameOver() {
			return gameOver;
		}

		function isStarted() {
			return started;
		}

		function setResumeListener(callback) {
			resumeCallback = callback;
		}

		function setPauseListener(callback) {
			pauseCallback = callback;
		}

		function setGameOverListener(callback) {
			gameOverCallback = callback;
		}

		function getSpeedLevel() {
			return board.speedLevel;
		}

		function getElapsedTime() {
			return board.elapsedTime;
		}

		function getScore() {
			return board.score;
		}

		return {
			resume: resumeGame,
			start: startGame,
			pause: pauseGame,
			isPaused: isPaused,
			isGameOver: isGameOver,
			isStarted: isStarted,
			setResumeListener: setResumeListener,
			setPauseListener: setPauseListener,
			setGameOverListener: setGameOverListener,
			getSpeedLevel: getSpeedLevel,
			getElapsedTime: getElapsedTime,
			getScore: getScore
		};
	};

	return root;

}(BC || {}))

