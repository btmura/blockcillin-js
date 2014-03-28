var BC = (function(parent) {

	var my = parent.Graphics = parent.Graphics || {};

	my.selector = function() {
		return {
			points: [
				0, 0, 0,
				1, 0, 0,
				1, 1, 0,
			],

			textureCoords: [
				0, 0,
				1, 0,
				1, 1
			]
		};
	}

	return parent;

}(BC || {}))