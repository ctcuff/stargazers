#version 300 es
precision mediump float;

in vec3 fragNormal;
in vec2 fragUV;

//uniform mat4 samplerCube cubemap;
uniform sampler2D tex;

out vec4 outColor; 
in vec3 fragNormal;

void main () {
    vec3 N = normalize(fragNormal);
    vec3 color = texture(tex, fragUV).rgb;
    outColor = vec4(color, 1);
}