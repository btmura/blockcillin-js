var BC = (function(root) {

	var me = root.Storage = root.Storage || {};

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