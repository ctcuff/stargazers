#version 300 es
precision mediump float;

in vec2 blurTexCoords[11];

out vec4 color;

uniform sampler2D tex;

void main(void) {
    color = vec4(0.0);
    color += texture(tex, blurTexCoords[0]) * 0.0093;
    color += texture(tex, blurTexCoords[1]) * 0.028002;
    color += texture(tex, blurTexCoords[2]) * 0.065984;
    color += texture(tex, blurTexCoords[3]) * 0.121703;
    color += texture(tex, blurTexCoords[4]) * 0.175713;
    color += texture(tex, blurTexCoords[5]) * 0.198596;
    color += texture(tex, blurTexCoords[6]) * 0.175713;
    color += texture(tex, blurTexCoords[7]) * 0.121703;
    color += texture(tex, blurTexCoords[8]) * 0.065984;
    color += texture(tex, blurTexCoords[9]) * 0.028002;
    color += texture(tex, blurTexCoords[10]) * 0.0093;
}
