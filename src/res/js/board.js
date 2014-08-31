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

	var me = root.Board = root.Board || {};

	me.make = function(args) {
		var CellState = BC.Cell.CellState;
		var Chain = BC.Chain;
		var Direction = BC.Direction
		var Drop = BC.Drop;
		var Log = BC.Log;
		var Matrix = BC.Math.Matrix;
		var Quantity = BC.Quantity;
		var Selector = BC.Selector;
		var Sound = BC.Audio.Sound;
		var Stage = BC.Stage;
		var Unit = BC.Unit;

		var metrics = args.metrics;
		var config = args.config;
		var audioPlayer = args.audioPlayer;

		var RING_CAPACITY = 11;
		var MAX_RISE_HEIGHT = RING_CAPACITY * metrics.ringHeight;

		var NUM_SPARE_RINGS = 2;
		var SPARE_RING_HEIGHT = NUM_SPARE_RINGS * metrics.ringHeight;

		var SPEED_LEVEL_DURATION = 30;
		var INITIAL_RISE_SPEED = 0.02;
		var RISE_SPEED_DELTA = 0.01;
		var RISE_UPDATE_COUNT = 100;

		// Keep track of the selector to know what cells to swap.
		var currentRing = 0;
		var currentCell = metrics.numCells - 1;

		// How much to go down before hitting the stage where new rings appear.
		var stageTranslationY = RING_CAPACITY / 2 * -metrics.ringHeight - metrics.ringHeight / 2;

		// How much the topmost ring has risen. Can't exceed the MAX_RISE_HEIGHT or game is over.
		var riseHeight = metrics.ringHeight * metrics.numRings;

		// Set the initial board translation to show the starting rings.
		var translationY = stageTranslationY + riseHeight;

		// Translation of the board. Y is increased over time.
		var translation = [0, translationY, 0];

		// Rotation of the board. Rotated on te z-axis by the selector.
		var rotation = [0, 0, 0];

		// Rings of cells on the board that are added and removed throughout the game.
		var rings = [];

		// Increasing counter used to translate each new ring relative to the board.
		var ringIndex = 0;

		var selector = Selector.make({
			metrics: metrics,
			config: config,
			audioPlayer: audioPlayer
		});

		var stage = Stage.make(metrics, stageTranslationY);

		var chainManager = Chain.makeManager();
		var dropManager = Drop.makeManager(metrics);

		var speedLevel = Quantity.make({
			value: 1,
			unit: Unit.NONE
		});

		var elapsedTime = Quantity.make({
			value: 0,
			unit: Unit.SECONDS
		});

		var score = Quantity.make({
			value: 0,
			unit: Unit.NONE
		});

		var board = {
			metrics: metrics,
			rings: rings,
			selector: selector,
			stage: stage,

			speedLevel: speedLevel,
			elapsedTime: elapsedTime,
			score:score,

			move: move,
			swap: swap,
			update: update,
			getDrawSpec: getDrawSpec
		};

		// Adds a new ring and increments the ring index counter.
		function addRing(selectable) {
			var translationY = -metrics.ringHeight * ringIndex;
			var newRing = BC.Ring.make({
				metrics: metrics,
				translationY: translationY,
				selectable: selectable,
				audioPlayer: audioPlayer
			});
			rings.push(newRing);

			ringIndex++;
		}

		// Removes the topmost ring. We don't decrement the index counter.
		function removeRing() {
			rings.shift();
			riseHeight -= metrics.ringHeight;
			currentRing--;
		}

		// Add the initial rings.
		for (var i = 0; i < metrics.numRings; i++) {
			addRing(true);
		}

		// Add the spare rings.
		for (var i = 0; i < NUM_SPARE_RINGS; i++) {
			addRing(false);
		}

		function move(direction) {
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

		function moveSelectorLeft() {
			if (selector.move(Direction.LEFT)) {;
				currentCell--;
				if (currentCell < 0) {
					currentCell = metrics.numCells - 1;
				}
			}
		}

		function moveSelectorRight() {
			if (selector.move(Direction.RIGHT)) {
				currentCell++;
				if (currentCell >= metrics.numCells) {
					currentCell = 0;
				}
			}
		}

		function moveSelectorUp() {
			if (currentRing > 0 && selector.move(Direction.UP)) {
				currentRing--;
			}
		}

		function moveSelectorDown() {
			if (currentRing + 1 < board.rings.length
					&& rings[currentRing + 1].isSelectable()
					&& selector.move(Direction.DOWN)) {
				currentRing++;
			}
		}

		function swap() {
			var leftCell = getCell(currentRing, currentCell);
			var rightCell = getCell(currentRing, currentCell + 1);
			var leftStyle = leftCell.blockStyle;
			var rightStyle = rightCell.blockStyle;
			var updatesPerSwap = config.getUpdatesPerSwap();

			BC.Log.log("swap: (" + leftCell.state + ", " + rightCell.state + ")");

			function isEmpty(cell) {
				return cell.state === CellState.EMPTY || cell.state === CellState.EMPTY_NO_DROP;
			}

			function isBlock(cell) {
				return cell.state === CellState.BLOCK;
			}

			var moveLeft = isEmpty(leftCell) && isBlock(rightCell);
			if (moveLeft) {
				rightCell.sendBlock(updatesPerSwap, Direction.LEFT);
				leftCell.receiveBlock(updatesPerSwap, Direction.RIGHT, rightStyle);
				audioPlayer.play(Sound.CELL_SWAP);
				return;
			}

			var moveRight = isBlock(leftCell) && isEmpty(rightCell);
			if (moveRight) {
				leftCell.sendBlock(updatesPerSwap, Direction.RIGHT);
				rightCell.receiveBlock(updatesPerSwap, Direction.LEFT, leftStyle);
				audioPlayer.play(Sound.CELL_SWAP);
				return;
			}

			var swap = isBlock(leftCell) && isBlock(rightCell);
			if (swap) {
				leftCell.receiveBlock(updatesPerSwap, Direction.RIGHT, rightStyle);
				rightCell.receiveBlock(updatesPerSwap, Direction.LEFT, leftStyle);
				audioPlayer.play(Sound.CELL_SWAP);
				return;
			}
		}

		function update() {
			// 1st pass - update each cell's existing animations.
			for (var i = 0; i < rings.length; i++) {
				for (var j = 0; j < metrics.numCells; j++) {
					var cell = getCell(i, j);
					cell.update();
				}
			}

			// Whether to raise the board.
			var stopRising = false;

			// 2nd pass - find new dropping blocks and update the board
			stopRising |= updateCellDrops();

			// 3rd pass - find new chains and update the board
			stopRising |= updateCellChains();

			if (!stopRising) {
				raiseBoard();
			}

			// Update the time-related stats.
			updateTimeStats();

			// Update selector which might have rotated the board.
			selector.update();

			// Add or remove rings.
			updateBoardRings();

			return isGameOver();
		}

		function updateTimeStats() {
			elapsedTime.value += config.getSecondsPerUpdate();
			speedLevel.value = 1 + Math.floor(elapsedTime.value / SPEED_LEVEL_DURATION);
		}

		function updateCellDrops() {
			return dropManager.update(board);
		}

		function updateCellChains() {
			var result = chainManager.update(board);
			for (var i = 0; i < result.newChains.length; i++) {
				var chain = result.newChains[i];
				score.value += 100 * chain.length;
			}
			return result.pendingChainCount > 0;
		}

		function raiseBoard() {
			var riseSpeed = INITIAL_RISE_SPEED + (speedLevel.value - 1) * RISE_SPEED_DELTA;
			var translationDelta = riseSpeed / RISE_UPDATE_COUNT;
			if (riseHeight + translationDelta > MAX_RISE_HEIGHT) {
				translationDelta = MAX_RISE_HEIGHT - riseHeight;
			}

			riseHeight += translationDelta;
			translation[1] += translationDelta;
		}

		function updateBoardRings() {
			// Remove any rings at the top that are now empty.
			while (rings.length > 0 && rings[0].isEmpty()) {
				removeRing();
			}

			// Add rings till we hit hit the ground and then add some spare rings.
			var totalRingHeight = metrics.ringHeight * rings.length;
			var gap = riseHeight - totalRingHeight;
			while (gap > -SPARE_RING_HEIGHT) {
				addRing(false); // We will update the selectability later.
				gap -= metrics.ringHeight;
			}

			// Update ring selectability.
			for (var i = rings.length - 1; i >= 0; i--) {
				// Quit since everything above should already be selectable.
				if (rings[i].isSelectable()) {
					break;
				}

				// Make rings selectable if they are above the ground (== 0).
				var bottom = riseHeight - metrics.ringHeight * (i + 1);
				if (bottom >= 0) {
					rings[i].setSelectable(true);
				}
			}
		}

		function isGameOver() {
			return riseHeight >= MAX_RISE_HEIGHT;
		}

		function getCell(row, col) {
			return rings[row].cells[col % metrics.numCells];
		}

		function getDrawSpec(lagFactor) {
			var translationMatrix = Matrix.makeTranslation(translation[0], translation[1], translation[2]);
			return {
				translationMatrix: translationMatrix
			};
		}

		return board;
	};

	return root;

}(BC || {}))
