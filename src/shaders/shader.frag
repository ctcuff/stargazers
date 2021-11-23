#version 300 es
precision mediump float;

in vec3 fragNormal;
in vec3 fragPosition;

out vec4 outColor;

uniform vec4 light;
uniform vec3 eyePosition;

uniform float ambientIntensity;
uniform vec3 specularColor;
uniform float shininess;
uniform float diffuse;

void main () {
    vec3 N = normalize(fragNormal);
    vec3 color = (N + 1.0) /2.0;
    outColor = vec4(color, 1);
}
