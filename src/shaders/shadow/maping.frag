#version 300 es
precision mediump float;

in vec2 passTexCoords;

out vec4 color;

uniform sampler2D tex;

void main(void) {
    // sample the alpha channel of the texture and discard this fragment if it is near 0
    float alpha = texture(tex, passTexCoords).a;
    if (alpha < 0.1) {
        discard;
    }

    // we dont really care about the color, only putting this in the depth buffer
    color = vec4(1.0);
}