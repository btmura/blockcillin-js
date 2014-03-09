BC.Time = (function() {
	return {
		getTimeInSeconds: function() {
			return Date.now() * 0.001;
		}
	};
}())
