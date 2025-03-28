precision mediump float;

in vec2 vUV;
in float vAlpha;
// in float vIndex;

uniform sampler2D myTexture;
uniform vec3 col1;
uniform vec3 col2;
uniform vec3 col3;
uniform float slider0;
uniform float slider1;
uniform float slider2;
uniform float time;
uniform float mouseVelocity;

float noise(vec2 p) {
    return sin(p.x * 10.0 * sin(p.y * 10.0));
}

void main() {
    float numberOfRings = 1.0;

    vec2 center = vec2(0.5, 0.5);
    vec2 pos = vUV - center;
    float dist = length(pos);

    // Create base ring pattern for distortion
    float baseRing = sin(dist * slider0 * 0.5 + time * 0.8);
    float flowAngle = atan(pos.y, pos.x) + baseRing * slider0 / 100.;

    // Create flowing distortion based on ring pattern
    vec2 flowDir = vec2(cos(flowAngle), sin(flowAngle));
    float flowStrength = (1.0 - dist) * 0.15 * sin(time * 0.1); // Stronger in center
    pos += flowDir * flowStrength * baseRing;

    float rotationAngle = (time * 0.05) * (slider0 * 0.1);
    mat2 rotation = mat2(cos(rotationAngle), -sin(rotationAngle), sin(rotationAngle * slider0 * 0.02), cos(rotationAngle));
    pos = rotation * pos;

    // Update rings to follow the flow
    float rings = sin(dist * slider0 + baseRing);
    float rings2 = sin(dist * 12.0 - flowAngle * numberOfRings +
        slider1 * 0.5 * dist * 0.5 +
        baseRing * 2.0);

    float ringEffect = mix(rings, rings2, slider1 / 100.0);

    // Soften the depth falloff
    float depth = 10.0 - pow(dist, 3.0);

    float lighting = dot(normalize(pos), vec2(0.707, 0.707));
    ringEffect = smoothstep(0.1, 2.0, abs(ringEffect)) * depth;
    ringEffect *= (0.5 + 0.3 * lighting);

    vec3 baseColor = col1;
    vec3 midColor = col2;
    vec3 highlightColor = col3;

    vec3 myOutputColor = mix(mix(baseColor, midColor, ringEffect), highlightColor, lighting * ringEffect * 0.8);

    gl_FragColor = vec4(myOutputColor, 1.0);
}

// 