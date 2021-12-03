#version 300 es
precision mediump float;

in vec2 texCoords;

out vec4 color;

uniform sampler2D colorTex;
uniform sampler2D highlightTex;

const float highlightIntensity = 1.0;

void main(void) {
  vec4 scene = texture(colorTex, texCoords);
  vec4 highlight = texture(highlightTex, texCoords);
  color = scene + (highlight * highlightIntensity);
}
