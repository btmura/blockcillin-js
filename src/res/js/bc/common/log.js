var BC = (function(root) {

	var parent = root.Common = root.Common || {};
	var me = parent.Log = parent.Log || {};

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
