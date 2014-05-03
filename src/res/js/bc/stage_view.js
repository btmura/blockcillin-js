var BC = (function(parent) {

	var module = parent.Stage = parent.Stage || {};
	var my = module.View = module.View || {};

	my.make = function(gl, metrics, textureTile) {
		var points = [];
		var i = 0;

		// TOP FACE
		points[i++] = -1.0;
		points[i++] = 0.0;
		points[i++] = 1.0;

		points[i++] = 1.0;
		points[i++] = 0.0;
		points[i++] = 1.0;

		points[i++] = 1.0;
		points[i++] = 0.0;
		points[i++] = -1.0;

		points[i++] = -1.0;
		points[i++] = 0.0;
		points[i++] = -1.0;

		// FRONT FACE
		points[i++] = -1.0;
		points[i++] = -1.0;
		points[i++] = 1.0;

		points[i++] = 1.0;
		points[i++] = -1.0;
		points[i++] = 1.0;

		points[i++] = 1.0;
		points[i++] = 0.0;
		points[i++] = 1.0;

		points[i++] = -1.0;
		points[i++] = 0.0;
		points[i++] = 1.0;

		var pointBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, pointBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(points), gl.STATIC_DRAW);

		var ll = textureTile.textureCoord(0, 0);
		var lr = textureTile.textureCoord(1, 0);
		var ur = textureTile.textureCoord(1, 1);
		var ul = textureTile.textureCoord(0, 1);

		var textureCoords = new Float32Array([].concat(ll, lr, ur, ul, ll, lr, ur, ul));
		var textureCoordBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, textureCoordBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, textureCoords, gl.STATIC_DRAW);

		var indices = new Uint16Array([
			0, 1, 2,
			0, 2, 3,

			4, 5, 6,
			4, 6, 7
		]);

		var indexBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
		gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);

		function draw(programLocations) {
			var positionLocation = programLocations.positionLocation;
			var textureCoordLocation = programLocations.textureCoordLocation;
			var yellowBoostLocation = programLocations.yellowBoostLocation;
			var alphaLocation = programLocations.alphaLocation;

			gl.bindBuffer(gl.ARRAY_BUFFER, pointBuffer);
			gl.enableVertexAttribArray(positionLocation);
			gl.vertexAttribPointer(positionLocation, 3, gl.FLOAT, false, 0, 0);

			gl.bindBuffer(gl.ARRAY_BUFFER, textureCoordBuffer);
			gl.enableVertexAttribArray(textureCoordLocation);
			gl.vertexAttribPointer(textureCoordLocation, 2, gl.FLOAT, false, 0, 0);

			gl.uniform1f(yellowBoostLocation, 0.0);
			gl.uniform1f(alphaLocation, 1.0);

			gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
			gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0);
		}

		return {
			draw: draw
		};
	};

	return parent;

}(BC || {}))