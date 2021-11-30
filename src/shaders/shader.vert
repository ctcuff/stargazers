#version 300 es

in vec3 position;
in vec3 normal;
in vec2 uv;

uniform mat4 modelMatrix;
uniform mat4 viewMatrix;
uniform mat4 projectionMatrix;

out vec3 fragNormal;
out vec3 fragPosition;
out vec2 fragUV;

void main () {
    fragUV = uv;
    vec4 newPosition = modelMatrix * vec4(position, 1);
    fragPosition = newPosition.xyz;
    gl_Position = projectionMatrix * viewMatrix * newPosition;
    mat4 normalMatrix = transpose(inverse(modelMatrix));
    fragNormal = normalize((normalMatrix * vec4(normal, 0)).xyz);
}
