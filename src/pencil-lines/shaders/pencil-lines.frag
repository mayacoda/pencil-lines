uniform sampler2D tDiffuse;
uniform vec2 uResolution;

varying vec2 vUv;


float valueAtPoint(sampler2D image, vec2 uv, vec2 texel, vec2 point) {
    vec3 luma = vec3(0.299, 0.587, 0.114);

    return dot(texture2D(image, uv + texel * point).xyz, luma);
}

float sobelFloat(sampler2D tDiffuse, vec2 uv, vec2 texel) {
    // kernel definition (in glsl matrices are filled in column-major order)
    const mat3 Gx = mat3(-1, -2, -1, 0, 0, 0, 1, 2, 1); // x direction kernel
    const mat3 Gy = mat3(-1, 0, 1, -2, 0, 2, -1, 0, 1); // y direction kernel

    // fetch the 3x3 neighbourhood of a fragment

    // first column
    float tx0y0 = valueAtPoint(tDiffuse, uv, texel, vec2(-1, -1));
    float tx0y1 = valueAtPoint(tDiffuse, uv, texel, vec2(-1, 0));
    float tx0y2 = valueAtPoint(tDiffuse, uv, texel, vec2(-1, 1));

    // second column
    float tx1y0 = valueAtPoint(tDiffuse, uv, texel, vec2(0, -1));
    float tx1y1 = valueAtPoint(tDiffuse, uv, texel, vec2(0, 0));
    float tx1y2 = valueAtPoint(tDiffuse, uv, texel, vec2(0, 1));

    // third column
    float tx2y0 = valueAtPoint(tDiffuse, uv, texel, vec2(1, -1));
    float tx2y1 = valueAtPoint(tDiffuse, uv, texel, vec2(1, 0));
    float tx2y2 = valueAtPoint(tDiffuse, uv, texel, vec2(1, 1));

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
    return G;
}

void main() {
    vec2 size = vec2(textureSize(tDiffuse, 0));
    vec4 texel = texture2D(tDiffuse, vUv);

    float sobelValue = sobelFloat(tDiffuse, vUv, 1.0 / uResolution) * 2.0;

    gl_FragColor = texel * (1.0 - sobelValue);
}
