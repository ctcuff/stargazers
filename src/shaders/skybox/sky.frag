#version 300 es
precision mediump float;

in vec3 texCoord;

out vec4 color;

uniform samplerCube skybox;

void main(void) {
    color = texture(skybox, normalize(texCoord));
    // color = vec4(1.0);
    // color = vec4(normalize(texCoord), 1.0);
}
