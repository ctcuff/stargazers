#version 300 es
precision mediump float;

in vec3 texCoord;

layout (location = 0) out vec4 color;
layout (location = 1) out vec4 brightColor;

uniform samplerCube skybox;

void main(void) {
    color = texture(skybox, normalize(texCoord));
    brightColor = vec4(vec3(0.0), 1.0);
}
