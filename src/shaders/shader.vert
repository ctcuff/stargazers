#version 300 es

in vec3 position;
in vec3 normal;
in vec2 uv;

uniform mat4 modelMatrix;
uniform mat4 viewMatrix;
uniform mat4 projectionMatrix;

uniform mat4 shadowMapSpace;
uniform float shadowDistance;
// used to prevent shadow artificats, can be a uniform or const
const float transitionPeriod = 10.0;

out vec2 fragUV;
out vec3 fragNormal;
out vec3 fragPosition;
out vec4 shadowCoords;

void main () {
    vec4 worldPosition = modelMatrix * vec4(position, 1);
    vec4 positionRelToCam = viewMatrix * worldPosition;
    mat4 normalMatrix = transpose(inverse(modelMatrix));

    // output interpolation units
    shadowCoords = shadowMapSpace * worldPosition;
    fragUV = uv;
    fragPosition = worldPosition.xyz;
    fragNormal = normalize((normalMatrix * vec4(normal, 0)).xyz);

    gl_Position = projectionMatrix * positionRelToCam;

    float distance = length(positionRelToCam.xyz);
    distance -= (shadowDistance - transitionPeriod);
    distance /= transitionPeriod;
    shadowCoords.w = clamp(1.0 - distance, 0.0, 1.0);
}
