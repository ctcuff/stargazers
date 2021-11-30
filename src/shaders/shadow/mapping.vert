#version 300 es

// NOTE (Joseph): these names are TODOs, as these depend on how the model is loaded
in vec3 position;
in vec2 texCoords;

out vec2 passTexCoords;

// NOTE (Joseph): this is one pre multiplied matrix representing the normal matrix trio of 
//                projection, view, and model
uniform mat4 pvmMatrix;

void main(void) {
    gl_Position = pvmMatrix * vec4(position, 1.0);
    passTexCoords = texCoords;
}
