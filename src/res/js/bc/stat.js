var BC = (function(root) {

	var me = root.Stat = root.Stat || {};

	me.make = function(args) {
		args = args || {};

		var value = args.value || 0;
		var unit = args.unit || BC.Unit.NONE;

		return {
			value: value,
			unit: unit
		};
	};

	return root;

}(BC || {}))