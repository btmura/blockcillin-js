var BC = (function(root) {

	var me = root.Stat = root.Stat || {};

	me.Unit = {
		INTEGER: 0,
		SECONDS: 1
	};

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