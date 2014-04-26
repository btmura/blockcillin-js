module("BC.Chain");

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