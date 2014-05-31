var BC = (function(root) {

	var parent = root.Score = root.Score || {};
	var me = parent.View = parent.View || {};

	me.make = function() {
		var scoreText = $("#score-text");

		function draw(score) {
			scoreText.text(score.score);
		}

		return {
			draw: draw
		};
	};

	return root;

}(BC || {}))