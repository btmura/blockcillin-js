var BC = (function(root) {

	var me = root.Audio = root.Audio || {};

	function newSound(offset, duration) {
		return {
			offset: offset,
			duration: duration
		};
	}

	me.Sound = {
		BUTTON_CLICK: newSound(0, 0.75),
		SELECTOR_MOVEMENT: newSound(1, 0.5),
		CELL_SWAP: newSound(2, 0.5),
		CELL_CLEAR: newSound(3, 0.5)
	};

	return root;

}(BC || {}))