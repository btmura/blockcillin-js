module("BC.Math");

test("radians", function() {
	var radians = BC.Math.radians;

	equal(radians(0), 0, "0 degrees");
	equal(radians(90), Math.PI / 2, "90 degrees");
	equal(radians(180), Math.PI, "180 degrees");
	equal(radians(360), 2 * Math.PI, "360 degrees");
});

test("circlePoints", function() {
	var close = QUnit.assert.close;
	var circlePoints = BC.Math.circlePoints;
	var maxErr = 0.0001;

	close(circlePoints(1, 2), [1, 0, -1, 0], maxErr,  "2 points - radius 1");
	close(circlePoints(2, 2), [2, 0, -2, 0], maxErr,  "2 points - radius 2");

	var theta = 2 * Math.PI / 3;
	var expectedPoints = [
		1, 0,
		Math.cos(theta), Math.sin(theta),
		Math.cos(theta * 2), Math.sin(theta * 2)
	];
	close(circlePoints(1, 3), expectedPoints, maxErr, "3 points - radius 1");

	var expectedPoints = [
		2, 0,
		2 * Math.cos(theta), 2 * Math.sin(theta),
		2 * Math.cos(theta * 2), 2 * Math.sin(theta * 2)
	];
	close(circlePoints(2, 3), expectedPoints, maxErr,  "3 points - radius 2");

	close(circlePoints(1, 4), [1, 0, 0, 1, -1, 0, 0, -1], maxErr,  "4 points - radius 1");
	close(circlePoints(2, 4), [2, 0, 0, 2, -2, 0, 0, -2], maxErr,  "4 points - radius 2");

	close(circlePoints(1, 4, Math.PI), [-1, 0, 0, -1, 1, 0, 0, 1], maxErr,
		"4 points - radius 1 - offset 180");
	close(circlePoints(2, 4, Math.PI), [-2, 0, 0, -2, 2, 0, 0, 2], maxErr,
		"4 points - radius 2 - offset 180");
});
