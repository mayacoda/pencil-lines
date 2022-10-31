#include <packing>

#include ./gradientNoise.glsl;

uniform sampler2D uDiffuse;
uniform sampler2D uSurfaceBuffer;
uniform sampler2D uDepthBuffer;

uniform sampler2D uCloudTexture;
uniform sampler2D uColorTexture;

uniform float uNear;
uniform float uFar;

uniform vec2 uResolution;

varying vec2 vUv;


// The MIT License
// Copyright © 2013 Inigo Quilez
// Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions: The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software. THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
// https://www.youtube.com/c/InigoQuilez
// https://iquilezles.org/
//
// https://www.shadertoy.com/view/lsf3WH
// SimonDev: Renamed function to "Math_Random" from "hash"
//float Math_Random(vec2 p)  // replace this by something better
//{
//    p  = 50.0*fract( p*0.3183099 + vec2(0.71,0.113));
//    return -1.0+2.0*fract( p.x*p.y*(p.x+p.y) );
//}
//
//float noise( in vec2 p )
//{
//    vec2 i = floor( p );
//    vec2 f = fract( p );
//
//    vec2 u = f*f*(3.0-2.0*f);
//
//    return mix( mix( Math_Random( i + vec2(0.0,0.0) ),
//    Math_Random( i + vec2(1.0,0.0) ), u.x),
//    mix( Math_Random( i + vec2(0.0,1.0) ),
//    Math_Random( i + vec2(1.0,1.0) ), u.x), u.y);
//}

float valueAtPoint(sampler2D image, vec2 coord, vec2 texel, vec2 point) {
    vec3 luma = vec3(0.299, 0.587, 0.114);

    return dot(texture2D(image, coord + texel * point).xyz, luma);
}

float diffuseValue(int x, int y) {
    float cutoff = 40.0;
    float offset =  0.5 / cutoff;
    float noiseValue = clamp(texture(uCloudTexture, vUv).r, 0.0, cutoff) / cutoff - offset;

    return valueAtPoint(uDiffuse, vUv + noiseValue, vec2(1.0 / uResolution.x, 1.0 / uResolution.y), vec2(x, y)) * 0.6;
}

float normalValue(int x, int y) {
    float cutoff = 50.0;
    float offset = 0.5 / cutoff;
    float noiseValue = clamp(texture(uCloudTexture, vUv).r, 0.0, cutoff) / cutoff - offset;

    return valueAtPoint(uSurfaceBuffer, vUv + noiseValue, vec2(1.0 / uResolution.x, 1.0 / uResolution.y), vec2(x, y)) * 0.3;
}

float getValue(int x, int y) {
    float noiseValue = noise(gl_FragCoord.xy);
    noiseValue = noiseValue * 2.0 - 1.0;
    noiseValue *= 10.0;

    return diffuseValue(x, y) + normalValue(x, y) * noiseValue;
//    return diffuseValue(x, y) + normalValue(x, y);
}

float getPixelDepth(int x, int y) {
    float fragCoordZ = texture2D(uDepthBuffer, vUv + vec2(x, y) * 1.0 / uResolution).x;
    float viewZ = perspectiveDepthToViewZ(fragCoordZ, uNear, uFar);
    return viewZToOrthographicDepth(viewZ, uNear, uFar);
}

vec3 getSurfaceValue(int x, int y) {
    return texture2D(uSurfaceBuffer, vUv + vec2(x, y) / uResolution).rgb;
}

float sobelFloat(sampler2D diffuse, vec2 uv, vec2 texel) {
    // kernel definition (in glsl matrices are filled in column-major order)
    const mat3 Gx = mat3(-1, -2, -1, 0, 0, 0, 1, 2, 1);// x direction kernel
    const mat3 Gy = mat3(-1, 0, 1, -2, 0, 2, -1, 0, 1);// y direction kernel

    // fetch the 3x3 neighbourhood of a fragment

    // first column
    float tx0y0 = getValue(-1, -1);
    float tx0y1 = getValue(-1, 0);
    float tx0y2 = getValue(-1, 1);

    // second column
    float tx1y0 = getValue(0, -1);
    float tx1y1 = getValue(0, 0);
    float tx1y2 = getValue(0, 1);

    // third column
    float tx2y0 = getValue(1, -1);
    float tx2y1 = getValue(1, 0);
    float tx2y2 = getValue(1, 1);

    // gradient value in x direction
    float valueGx = Gx[0][0] * tx0y0 + Gx[1][0] * tx1y0 + Gx[2][0] * tx2y0 +
    Gx[0][1] * tx0y1 + Gx[1][1] * tx1y1 + Gx[2][1] * tx2y1 +
    Gx[0][2] * tx0y2 + Gx[1][2] * tx1y2 + Gx[2][2] * tx2y2;

    // gradient value in y direction
    float valueGy = Gy[0][0] * tx0y0 + Gy[1][0] * tx1y0 + Gy[2][0] * tx2y0 +
    Gy[0][1] * tx0y1 + Gy[1][1] * tx1y1 + Gy[2][1] * tx2y1 +
    Gy[0][2] * tx0y2 + Gy[1][2] * tx1y2 + Gy[2][2] * tx2y2;

    // magnitute of the total gradient
    float G = (valueGx * valueGx) + (valueGy * valueGy);
    return clamp(G, 0.0, 1.0);
}

float readDepth( sampler2D depthSampler, vec2 coord ) {
    float fragCoordZ = texture2D( depthSampler, coord ).x;
    float viewZ = perspectiveDepthToViewZ( fragCoordZ, uNear, uFar );
    return viewZToOrthographicDepth( viewZ, uNear, uFar );
}


void main() {
    vec2 size = vec2(textureSize(uDiffuse, 0));
    vec4 texel = texture2D(uDiffuse, vUv);

    vec2 fragCoord = gl_FragCoord.xy;

    vec2 noiseValue = vec2(noise(fragCoord));
    noiseValue = noiseValue * 2.0 - 1.0;
    noiseValue *= 10.0;

    vec4 cloudNoiseValue = texture2D(uCloudTexture, vUv);

    float sobelValue = sobelFloat(uDiffuse, vUv, 1.0 / uResolution);
    sobelValue = smoothstep(0.01, 0.03, sobelValue);

    vec4 uLineColor = vec4(0.32, 0.12, 0.2, 1.0);

    if (sobelValue > 0.1) {
        gl_FragColor = uLineColor * 0.5;
    } else {
        gl_FragColor = texel;
    }
}
