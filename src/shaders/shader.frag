#version 300 es
precision mediump float;

in vec3 fragNormal;

out vec4 outColor; 

void main () {
    vec3 N = normalize(fragNormal);
    vec3 color = (N + 1.0) /2.0;
    outColor = vec4(color, 1);
}
