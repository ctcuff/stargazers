#version 300 es
precision mediump float;

in vec2 fragUV;
in vec3 fragNormal;
in vec4 shadowCoords;

uniform sampler2D tex;
uniform vec3 eyePosition;

uniform vec3 light;
uniform float ambient; // ka
uniform float diffuse; // kd
uniform float specularity; // ks

uniform sampler2D shadowMap;
uniform float shadowMapSize;

out vec4 outColor;

// constants for percentage closer filtering
const int pcfCount = 2;
// number of texture pixels that will be sampled
const float totalTexels = (float(pcfCount) * 2.0 + 1.0) * (float(pcfCount) * 2.0 + 1.0);
// prevents shadow acne
const float shadowBias = 0.02;

void main () {
    // run PCF on the shadows
    float texelSize = 1.0 / shadowMapSize;
    float totalCount = 0.0;
    for (int x = -pcfCount; x <= pcfCount; x++) {
        for (int y = -pcfCount; y <= pcfCount; y++) {
            vec2 uv = shadowCoords.xy + (vec2(x, y) * texelSize);
            float objectNearestLight = texture(shadowMap, uv).r;
            if (shadowCoords.z > objectNearestLight + shadowBias) {
                totalCount += 1.0;
            }
        }
    }
    float total = clamp(totalCount / totalTexels, 0.0, 1.0);
    float lightFactor = 1.0 - (total * shadowCoords.w);

    vec3 N = normalize(fragNormal);
    vec3 L = normalize(light);
    vec3 textureColor = texture(tex, fragUV).rgb;

    vec3 diffuseColor = textureColor * clamp(dot(L,N), 0.0, 1.0) * lightFactor;
    vec3 ambientColor = textureColor * ambient;
    
    vec3 finalColor = diffuse * diffuseColor + ambientColor;
    outColor = vec4(finalColor, 1);
}