var BC = (function(root) {

	var parent = root.App = root.App || {};
	var me = parent.Stat = parent.Stat || {};

	me.make = function(args) {
		var value = args.value;
		var unit = args.unit;
		return {
			value: value,
			unit: unit
		};
	};

	return root;

}(BC || {}))