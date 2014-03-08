module("BC.Time");

test("getTimeInSeconds", function() {

	function setTime(ms) {
		Date.now = function() {
			return ms;
		};
	}

	setTime(1000);
	equal(BC.Time.getTimeInSeconds(), 1, "1 second");

	setTime(2500);
	equal(BC.Time.getTimeInSeconds(), 2.5, "2.5 seconds");
});
