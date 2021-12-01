#version 300 es
precision mediump float;

out vec4 outColor;

// Temporary base color until textures are added
uniform vec3 materialColor;

uniform vec3 light;
uniform float ambient;

uniform float diffuse;

//uniform mat4 samplerCube cubemap;
uniform sampler2D tex;
uniform vec3 eyePosition;

in vec3 fragNormal;

void main () {
    vec3 N = normalize(fragNormal);
    vec3 L = normalize(light);
    vec3 color = diffuse * materialColor * clamp(dot(L,N), 0.,1.);
    outColor = vec4(color, 1);
}
