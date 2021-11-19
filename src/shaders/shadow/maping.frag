#version 300 es
precision mediump float;

in vec2 passTexCoords;

out vec4 color;

// NOTE (Joseph): this name is a TODO, and will need to be changed when actual textures are implemented
uniform sampler2D modelTexture;

void main(void) {
    // sample the alpha channel of the texture and discard this fragment if it is near 0
    float alpha = texture(modelTexture, passTexCoords).a;
    if (alpha < 0.1) {
        discard;
    }

    // we dont really care about the color, only putting this in the depth buffer
    color = vec4(1.0);
}