#version 300 es

in vec3 position;

out vec3 texCoord;

uniform mat4 projectionMatrix;
uniform mat4 viewMatrix;

void main(void) {
    gl_Position = projectionMatrix * viewMatrix * vec4(position, 1.0);
    texCoord = position;
}
