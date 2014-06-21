var BC = (function(root) {

	var parent = root.Core = root.Core || {};
	var me = parent.Stat = parent.Stat || {};

	me.make = function(args) {
		args = args || {};

		var value = args.value || 0;
		var unit = args.unit || BC.Common.Unit.NONE;

		return {
			value: value,
			unit: unit
		};
	};

	return root;

}(BC || {}))