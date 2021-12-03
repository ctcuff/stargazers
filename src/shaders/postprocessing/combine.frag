#version 300 es
precision mediump float;

in vec2 texCoords;

out vec4 color;

uniform sampler2D colorTex;
uniform sampler2D highlightTex;

// TODO uniform controller
const float highlightIntensity = 0.0; // TODO raise this to 1.0 later

void main(void) {
  vec4 scene = texture(colorTex, texCoords);
  vec4 highlight = texture(highlightTex, texCoords);
  color = scene + (highlight * highlightIntensity);
}
