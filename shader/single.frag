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

void main() {

    vec2 center = vec2(0.5, 0.5);
    vec2 pos = vUV - center;
    float dist = length(pos);

    float rotationAngle = (time * 0.05) * (slider0 * 0.1); // Adjust speed by changing multiplier
    mat2 rotation = mat2(cos(rotationAngle), -sin(rotationAngle), sin(rotationAngle * slider0 * 0.02), cos(rotationAngle));
    pos = rotation * pos;

    // Create multiple rings by using sin of distance and time
    float rings = sin(dist * slider0);
    float rings2 = sin(dist * 12.0 - atan(pos.y, pos.x) * 5.0 + slider1 * 0.5 * dist * 0.5);

    float ringEffect = mix(rings, rings2, slider1 / 100.0);

    float depth = 10.0 - pow(dist, 5.0);

    float lighting = dot(normalize(pos), vec2(0.707, 0.707));
    ringEffect = smoothstep(0.1, 1.3, abs(ringEffect)) * depth;
    ringEffect *= (0.6 + 0.2 * lighting);

    vec3 baseColor = col1;
    vec3 midColor = col2;
    vec3 highlightColor = col3;

    vec3 myOutputColor = mix(mix(baseColor, midColor, ringEffect), highlightColor, lighting * ringEffect * 0.8);

    gl_FragColor = vec4(myOutputColor, 1.0);
}

// 