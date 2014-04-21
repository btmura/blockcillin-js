var BC = (function(parent) {

	var my = parent.Util = parent.Util || {}

	my.log = function(msg) {
		if (window.console) {
			if (window.console.log) {
				window.console.log(msg);
			}
		}
	};

	my.error = function(msg) {
		if (window.console) {
			if (window.console.error) {
				window.console.error(msg);
			} else if (window.console.log) {
				window.console.log(msg);
			}
		}
	};

	return parent;

}(BC || {}))
