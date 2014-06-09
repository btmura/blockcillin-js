var BC = (function(root) {

	var me = root.Constants = root.Constants || {};

	// TODO(btmura): use strings for values since object keys are strings
	me.Direction = {
		NONE : 0,
		UP : 1,
		DOWN: 2,
		LEFT: 3,
		RIGHT: 4
	};

	return root;

}(BC || {}))