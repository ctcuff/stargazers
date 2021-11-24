#version 300 es

in vec2 position;

out vec2 blurTexCoords[11];

uniform float width;

void main(void) {
    gl_Position = vec4(position, 0.0, 1.0);
    vec2 centerTexCoords = position * 0.5 + 0.5;

    float pixelSize = 1.0 / width;

    for (int i = -5; i <= 5; i++) {
        blurTexCoords[i + 5] = centerTexCoords + vec2(pixelSize * float(i), 0.0);
    }
}