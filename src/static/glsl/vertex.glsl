attribute vec2 a_position;

uniform vec2 u_translation;
uniform vec2 u_rotation;

void main() {
	vec2 rotatedPosition = vec2(
		a_position.x * u_rotation.x + a_position.y * u_rotation.y,
		a_position.y * u_rotation.x - a_position.x * u_rotation.y 
	);

	vec2 position = rotatedPosition + u_translation;
	gl_Position = vec4(position, 0, 1);
}