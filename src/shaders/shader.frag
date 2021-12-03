#version 300 es
precision mediump float;

in vec3 fragNormal;
in vec2 fragUV;

uniform sampler2D tex;
uniform vec3 eyePosition;

uniform vec3 light;
uniform float ambient; // ka
uniform float diffuse; // kd
uniform float specularity; // ks

out vec4 outColor;

void main () {
    vec3 N = normalize(fragNormal);
    vec3 L = normalize(light);
    vec3 textureColor = texture(tex, fragUV).rgb;
    vec3 diffuseColor = textureColor * clamp(dot(L,N), 0.0, 1.0);
    vec3 ambientColor = textureColor * ambient;
    vec3 finalColor = diffuse * diffuseColor + ambientColor;
    outColor = vec4(finalColor, 1);
}