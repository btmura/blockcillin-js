function makePerspective(fieldOfViewInRadians, aspect, near, far) {
	var f = Math.tan(Math.PI * 0.5 - 0.5 * fieldOfViewInRadians);
	var rangeInv = 1.0 / (near - far);
	return [
		f / aspect, 0, 0, 0,
		0, f, 0, 0,
		0, 0, (near + far) * rangeInv, -1,
		0, 0, near * far * rangeInv *2, 0
	];
}

function makeTranslation(tx, ty, tz) {
	return [
		1, 0, 0, 0,
		0, 1, 0, 0,
		0, 0, 1, 0,
		tx, ty, tz, 1
	];
}

function makeXRotation(angleInRadians) {
	var c = Math.cos(angleInRadians);
	var s = Math.sin(angleInRadians);
	return [
		1, 0, 0, 0,
		0, c, s, 0,
		0, -s, c, 0,
		0, 0, 0, 1
	];
}

function makeYRotation(angleInRadians) {
	var c = Math.cos(angleInRadians);
	var s = Math.sin(angleInRadians);
	return [
		c, 0, -s, 0,
		0, 1, 0, 0,
		s, 0, c, 0,
		0, 0, 0, 1
	];
}

function makeZRotation(angleInRadians) {
	var c = Math.cos(angleInRadians);
	var s = Math.sin(angleInRadians);
	return [
		c, s, 0, 0,
		-s, c, 0, 0,
		0, 0, 1, 0,
		0, 0, 0, 1
	];
}


function makeScale(sx, sy, sz) {
	return [
		sx, 0, 0, 0,
		0, sy, 0, 0,
		0, 0, sz, 0,
		0, 0, 0, 1
	];
}

function matrixMultiply(m, n) {
	return [
		m[0]*n[0] + m[1]*n[4] + m[2]*n[8] + m[3]*n[12], 
		m[0]*n[1] + m[1]*n[5] + m[2]*n[9] + m[3]*n[13], 
		m[0]*n[2] + m[1]*n[6] + m[2]*n[10] + m[3]*n[14], 
		m[0]*n[3] + m[1]*n[7] + m[2]*n[11] + m[3]*n[15],


		m[4]*n[0] + m[5]*n[4] + m[6]*n[8] + m[7]*n[12], 
		m[4]*n[1] + m[5]*n[5] + m[6]*n[9] + m[7]*n[13], 
		m[4]*n[2] + m[5]*n[6] + m[6]*n[10] + m[7]*n[14], 
		m[4]*n[3] + m[5]*n[7] + m[6]*n[11] + m[7]*n[15],

		m[8]*n[0] + m[9]*n[4] + m[10]*n[8] + m[11]*n[12], 
		m[8]*n[1] + m[9]*n[5] + m[10]*n[9] + m[11]*n[13], 
		m[8]*n[2] + m[9]*n[6] + m[10]*n[10] + m[11]*n[14], 
		m[8]*n[3] + m[9]*n[7] + m[10]*n[11] + m[11]*n[15],

		m[12]*n[0] + m[13]*n[4] + m[14]*n[8] + m[15]*n[12], 
		m[12]*n[1] + m[13]*n[5] + m[14]*n[9] + m[15]*n[13], 
		m[12]*n[2] + m[13]*n[6] + m[14]*n[10] + m[15]*n[14], 
		m[12]*n[3] + m[13]*n[7] + m[14]*n[11] + m[15]*n[15]
	];
}
