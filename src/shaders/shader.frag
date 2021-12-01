#version 300 es
precision mediump float;

in vec3 fragNormal;
in vec2 fragUV;

uniform sampler2D tex;

out vec4 outColor; 

void main () {
    vec3 N = normalize(fragNormal);
    vec3 color = texture(tex, fragUV).rgb;
    outColor = vec4(color, 1);
}