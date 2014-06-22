var BC = (function(root) {

	var me = root.Log = root.Log || {};

	me.log = function(msg) {
		if (window.console) {
			if (window.console.log) {
				window.console.log(msg);
			}
		}
	};

	me.error = function(msg) {
		if (window.console) {
			if (window.console.error) {
				window.console.error(msg);
			} else if (window.console.log) {
				window.console.log(msg);
			}
		}
	};

	return root;

}(BC || {}))
