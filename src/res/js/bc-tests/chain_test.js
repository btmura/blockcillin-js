module("BC.Chain");

test("find_horizontalChains", function() {
	var board = BC.Chain.makeBoard([
		[1, 1, 1, 0],
		[0, 2, 2, 2],
		[3, 0, 3, 3],
		[4, 4, 0, 4],
		[5, 5, 5, 5]
	]);

	var actual = BC.Chain.find(board);
	var expected = [

		// Chain of 1s in the 1st row with no wrapping.
		[
			{
				cell: board.rings[0].cells[0],
				row: 0,
				col: 0
			},
			{
				cell: board.rings[0].cells[1],
				row: 0,
				col: 1
			},
			{
				cell: board.rings[0].cells[2],
				row: 0,
				col: 2
			}
		],

		// Chain of 2s in the 3rd row from wrapping around.
		[
			{
				cell: board.rings[1].cells[1],
				row: 1,
				col: 1
			},
			{
				cell: board.rings[1].cells[2],
				row: 1,
				col: 2
			},
			{
				cell: board.rings[1].cells[3],
				row: 1,
				col: 3
			}
		],

		// Chain of 3s in the 3rd row from wrapping aronud.
		[
			{
				cell: board.rings[2].cells[2],
				row: 2,
				col: 2
			},
			{
				cell: board.rings[2].cells[3],
				row: 2,
				col: 3
			},
			{
				cell: board.rings[2].cells[0],
				row: 2,
				col: 0
			}
		],

		// Chain of 4s in the 4th row from wrapping around.
		[
			{
				cell: board.rings[3].cells[3],
				row: 3,
				col: 3
			},
			{
				cell: board.rings[3].cells[0],
				row: 3,
				col: 0
			},
			{
				cell: board.rings[3].cells[1],
				row: 3,
				col: 1
			}
		],

		// Chain of all 5s in the 5th row
		[
			{
				cell: board.rings[4].cells[0],
				row: 4,
				col: 0
			},
			{
				cell: board.rings[4].cells[1],
				row: 4,
				col: 1
			},
			{
				cell: board.rings[4].cells[2],
				row: 4,
				col: 2
			},
			{
				cell: board.rings[4].cells[3],
				row: 4,
				col: 3
			}
		]
	];

	deepEqual(actual, expected);
});

test("find_verticalChains", function() {
	var board = BC.Chain.makeBoard([
		[1, 2, 2, 4],
		[1, 3, 5, 4],
		[1, 3, 5, 4],
		[0, 3, 2, 4]
	]);

	var actual = BC.Chain.find(board);
	var expected = [
		// Chain of 1s in the 1st column
		[
			{
				cell: board.rings[0].cells[0],
				row: 0,
				col: 0
			},
			{
				cell: board.rings[1].cells[0],
				row: 1,
				col: 0
			},
			{
				cell: board.rings[2].cells[0],
				row: 2,
				col: 0
			}
		],

		// Chain of 3s in the 2nd column
		[
			{
				cell: board.rings[1].cells[1],
				row: 1,
				col: 1
			},
			{
				cell: board.rings[2].cells[1],
				row: 2,
				col: 1
			},
			{
				cell: board.rings[3].cells[1],
				row: 3,
				col: 1
			}
		],

		// Chain of 4s in the 4th column
		[
			{
				cell: board.rings[0].cells[3],
				row: 0,
				col: 3
			},
			{
				cell: board.rings[1].cells[3],
				row: 1,
				col: 3
			},
			{
				cell: board.rings[2].cells[3],
				row: 2,
				col: 3
			},
			{
				cell: board.rings[2].cells[3],
				row: 3,
				col: 3
			}
		]
	];

	deepEqual(actual, expected);
});

test("find_crossChains", function() {
	var board = BC.Chain.makeBoard([
		[0, 1, 0],
		[1, 1, 1],
		[0, 1, 0]
	]);

	var actual = BC.Chain.find(board);
	var expected = [
		[
			{
				cell: board.rings[0].cells[1],
				row: 0,
				col: 1
			},
			{
				cell: board.rings[1].cells[0],
				row: 1,
				col: 0
			},
			{
				cell: board.rings[1].cells[1],
				row: 1,
				col: 1
			},
			{
				cell: board.rings[1].cells[2],
				row: 1,
				col: 2
			},
			{
				cell: board.rings[2].cells[1],
				row: 2,
				col: 1
			}
		],
	];

	deepEqual(actual, expected);
});


QUnit.extend(BC.Chain, {
	makeBoard: function(specs) {
		var rings = [];
		for (var i = 0; i < specs.length; i++) {
			var cells = [];
			for (var j = 0; j < specs[i].length; j++) {
				var cell = {
					blockStyle: specs[i][j],
					state: BC.Cell.CellState.BLOCK
				};
				cells.push(cell);
			}
			var ring = {
				cells: cells
			};
			rings.push(ring);
		}

		return {
			rings: rings
		};
	}
});