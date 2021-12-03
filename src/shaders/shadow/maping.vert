#version 300 es

in vec3 position;
in vec2 uv;

out vec2 passTexCoords;

// NOTE (Joseph): this is one pre multiplied matrix representing the normal matrix trio of 
//                projection, view, and model
uniform mat4 pvmMatrix;

void main(void) {
    gl_Position = pvmMatrix * vec4(position, 1.0);
    passTexCoords = uv;
}
