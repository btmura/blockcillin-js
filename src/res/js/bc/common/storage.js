var BC = (function(root) {

	var parent = root.Common = root.Common || {};
	var me = parent.Storage = parent.Storage || {};

	me.make = function() {

		var storage = localStorage || {};

		function get(key) {
			return storage[key];
		}

		function set(key, value) {
			storage[key] = value;
		}

		return {
			get: get,
			set: set
		};
	};

	return root;

}(BC || {}))