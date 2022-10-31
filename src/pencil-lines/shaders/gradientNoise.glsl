// The MIT License
// Copyright © 2013 Inigo Quilez
// Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions: The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software. THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
// https://www.youtube.com/c/InigoQuilez
// https://iquilezles.org


// Gradient Noise (http://en.wikipedia.org/wiki/Gradient_noise), not to be confused with
// Value Noise, and neither with Perlin's Noise (which is one form of Gradient Noise)
// is probably the most convenient way to generate noise (a random smooth signal with
// mostly all its energy in the low frequencies) suitable for procedural texturing/shading,
// modeling and animation.
//
// It produces smoother and higher quality than Value Noise, but it's of course slighty more
// expensive.
//
// The princpiple is to create a virtual grid/latice all over the plane, and assign one
// random vector to every vertex in the grid. When querying/requesting a noise value at
// an arbitrary point in the plane, the grid cell in which the query is performed is
// determined, the four vertices of the grid are determined and their random vectors
// fetched. Then, the position of the current point under  evaluation relative to each
// vertex is doted (projected) with that vertex' random vector, and the result is
// bilinearly interpolated with a smooth interpolant.


// Value    Noise 2D, Derivatives: https://www.shadertoy.com/view/4dXBRH
// Gradient Noise 2D, Derivatives: https://www.shadertoy.com/view/XdXBRH
// Value    Noise 3D, Derivatives: https://www.shadertoy.com/view/XsXfRH
// Gradient Noise 3D, Derivatives: https://www.shadertoy.com/view/4dffRH
// Value    Noise 2D             : https://www.shadertoy.com/view/lsf3WH
// Value    Noise 3D             : https://www.shadertoy.com/view/4sfGzS
// Gradient Noise 2D             : https://www.shadertoy.com/view/XdXGW8
// Gradient Noise 3D             : https://www.shadertoy.com/view/Xsl3Dl
// Simplex  Noise 2D             : https://www.shadertoy.com/view/Msf3WH
// Wave     Noise 2D             : https://www.shadertoy.com/view/tldSRj

// replace this anything that returns a random vector
vec2 grad(ivec2 z) {
    // 2D to 1D  (feel free to replace by some other)
    int n = z.x+z.y*11111;

    // Hugo Elias hash (feel free to replace by another one)
    n = (n<<13)^n;
    n = (n*(n*n*15731+789221)+1376312589)>>16;

    #if 0

    // simple random vectors
    return vec2(cos(float(n)), sin(float(n)));

    #else

    // Perlin style vectors
    n &= 7;
    vec2 gr = vec2(n&1, n>>1)*2.0-1.0;
    return (n>=6) ? vec2(0.0, gr.x) :
    (n>=4) ? vec2(gr.x, 0.0) :
    gr;
    #endif
}

float noise(in vec2 p) {
    ivec2 i = ivec2(floor(p));
    vec2 f = fract(p);

    vec2 u = f*f*(3.0-2.0*f);// feel free to replace by a quintic smoothstep instead

    return mix(mix(dot(grad(i+ivec2(0, 0)), f-vec2(0.0, 0.0)),
    dot(grad(i+ivec2(1, 0)), f-vec2(1.0, 0.0)), u.x),
    mix(dot(grad(i+ivec2(0, 1)), f-vec2(0.0, 1.0)),
    dot(grad(i+ivec2(1, 1)), f-vec2(1.0, 1.0)), u.x), u.y);
}
