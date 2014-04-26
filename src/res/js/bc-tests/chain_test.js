module("BC.Chain");

test("find_verticalChain_three", function() {
	var board = BC.Chain.makeBoard([
		[1],
		[1],
		[1],
		[0]
	]);

	var actual = BC.Chain.find(board);
	var expected = [
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
		]
	];

	deepEqual(actual, expected);
});

test("find_verticalChain_four", function() {
	var board = BC.Chain.makeBoard([
		[1],
		[1],
		[1],
		[1]
	]);

	var actual = BC.Chain.find(board);
	var expected = [
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

			},
			{
				cell: board.rings[3].cells[0],
				row: 3,
				col: 0
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