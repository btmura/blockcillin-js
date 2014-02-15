attribute vec2 a_position;

uniform vec2 u_translation;

void main() {
	vec2 position = a_position + u_translation;
	gl_Position = vec4(position, 0, 1);
}