#version 300 es

in vec2 position;

uniform mat4 transform;

out vec2 texCoords;

void main(void) {
    gl_Position = transform * vec4(position, 0.0, 1.0);
    texCoords = position * 0.5 + 0.5;
}