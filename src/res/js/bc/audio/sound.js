var BC = (function(root) {

	var me = root.Audio = root.Audio || {};

	// Sounds are spaced 1 sec apart in the single file.
	var DURATION = 0.5;

	function newSound(offset) {
		return {
			offset: offset,
			duration: DURATION
		};
	}

	me.Sound = {
		BUTTON_CLICK: newSound(0),
		SELECTOR_MOVEMENT: newSound(1),
		CELL_SWAP: newSound(2),
		CELL_CLEAR: newSound(3)
	};

	return root;

}(BC || {}))