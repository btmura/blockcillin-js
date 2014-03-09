BC.Util = (function() {
	return {
		error: function(msg) {
			if (window.console) {
				if (window.console.error) {
					window.console.error(msg);
				} else if (window.console.log) {
					window.console.log(msg);
				}
			}
		}
	}
}())
