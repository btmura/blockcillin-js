test("BC.Math.radians", function() {
	equal(BC.Math.radians(0), 0, "0 degrees");
	equal(BC.Math.radians(90), Math.PI / 2, "90 degrees");
	equal(BC.Math.radians(180), Math.PI, "180 degrees");
	equal(BC.Math.radians(360), 2 * Math.PI, "360 degrees");
});


