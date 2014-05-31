var BC = (function(root) {

	var me = root.Stat = root.Stat || {};

	me.make = function(value) {
		return {
			value: value
		};
	};

	return root;

}(BC || {}))