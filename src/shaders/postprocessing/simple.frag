#version 300 es
precision mediump float;

in vec2 texCoords;

out vec4 color;

uniform sampler2D colorTex;

void main(void) {
  color = texture(colorTex, texCoords);
}