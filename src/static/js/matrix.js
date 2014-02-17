function makeTranslation(tx, ty) {
	return [
		1, 0, 0,
		0, 1, 0,
		tx, ty, 1
	];
}

function makeRotation(angleInRadians) {
	var c = Math.cos(angleInRadians);
	var s = Math.sin(angleInRadians);
	return [
		c, -s, 0,
		s, c, 0,
		0, 0, 1
	];
}

function makeScale(sx, sy) {
	return [
		sx, 0, 0,
		0, sy, 0,
		0, 0, 1
	];
}

function matrixMultiply(m, n) {
	return [
		m[0]*n[0] + m[1]*n[3] + m[2]*n[6], 
		m[0]*n[1] + m[1]*n[4] + m[2]*n[7], 
		m[0]*n[2] + m[1]*n[5] + m[2]*n[8],

		m[3]*n[0] + m[4]*n[3] + m[5]*n[6], 
		m[3]*n[1] + m[4]*n[4] + m[5]*n[7], 
		m[3]*n[2] + m[4]*n[5] + m[5]*n[8],

		m[6]*n[0] + m[7]*n[3] + m[8]*n[6], 
		m[6]*n[1] + m[7]*n[4] + m[8]*n[7], 
		m[6]*n[2] + m[7]*n[5] + m[8]*n[8]
	];
}
