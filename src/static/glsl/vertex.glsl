attribute vec2 a_position;

uniform vec2 u_translation;
uniform vec2 u_rotation;
uniform vec2 u_scale;

void main() {
	vec2 scaledPosition = a_position * u_scale;

	vec2 rotatedPosition = vec2(
		scaledPosition.x * u_rotation.x + scaledPosition.y * u_rotation.y,
		scaledPosition.y * u_rotation.x - scaledPosition.x * u_rotation.y 
	);

	vec2 position = rotatedPosition + u_translation;

	gl_Position = vec4(position, 0, 1);
}