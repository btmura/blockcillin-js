var BC = (function(parent) {

	var my = parent.Game = parent.Game || {}

	my.run = function() {
		var Direction = BC.Constants.Direction;

		var canvas = document.getElementById("canvas");
		if (!canvas) {
			return;
		}

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
		gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

		var vertexShader = BC.GL.loadShader(gl, 'vertex-shader', gl.VERTEX_SHADER);
		var fragmentShader = BC.GL.loadShader(gl, 'fragment-shader', gl.FRAGMENT_SHADER);
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
			textureCoordLocation: getAttrib("a_texcoord"),

			projectionMatrixLocation: getUniform("u_projectionMatrix"),
			viewMatrixLocation: getUniform("u_viewMatrix"),

			boardMatrixLocation: getUniform("u_boardMatrix"),
			ringMatrixLocation: getUniform("u_ringMatrix"),
			cellMatrixLocation: getUniform("u_cellMatrix")
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
			var cameraPosition = [0, 0.75, 2];
			var targetPosition = [0, 0, 0];
			var up = [0, 1, 0];
			var cameraMatrix = BC.Matrix.makeLookAt(cameraPosition, targetPosition, up);
			return BC.Matrix.makeInverse(cameraMatrix);
		}

		// Create the initial view matrix. Doesn't need to be set again later.
		var viewMatrix = makeViewMatrix();
		gl.uniformMatrix4fv(programLocations.viewMatrixLocation, false, viewMatrix);

		var board = BC.Board.make({
			numRingCells: 24,
			numBlockStyles: 6,
			innerRingRadius: 0.75,
			outerRingRadius: 1,
			ringMaxY: 0.15,
			ringMinY: -0.15
		});

		var boardView = BC.BoardView.make(board, gl, programLocations);

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
						board.move(Direction.LEFT);
					} else if (deltaX < -touchThreshold) {
						board.move(Direction.RIGHT);
					} else if (deltaY > touchThreshold) {
						board.move(Direction.DOWN);
					} else if (deltaY < -touchThreshold) {
						board.move(Direction.UP);
					} else {
						board.swap();
					}
					break;
			}
			return false;
		});

		$(document).keydown(function(event) {
			switch (event.keyCode) {
				case 32: // space
					board.swap();
					break;

				case 37: // left
					board.move(Direction.LEFT);
					break;

				case 39: // right
					board.move(Direction.RIGHT);
					break;

				case 38: // up
					board.move(Direction.UP);
					break;

				case 40: // down
					board.move(Direction.DOWN);
					break;
			}
			return false;
		});

		var then = BC.Time.getTimeInSeconds();

		function drawScene() {
			gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
			gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
			gl.uniformMatrix4fv(programLocations.projectionMatrixLocation, false, projectionMatrix);

			var now = BC.Time.getTimeInSeconds();
			var deltaTime = now - then;
			then = now;

			board.update(deltaTime, now);
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
