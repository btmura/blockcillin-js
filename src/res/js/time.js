var BC = (function(parent) {

	var my = parent.Time = parent.Time || {}

	my.getTimeInSeconds = function() {
		return Date.now() * 0.001;
	}

	return parent;

}(BC || {}))
