varying vec2 vUv; // varying allows us to share data between the vertex and fragment shaders 

// pi
#define PI 3.14159265359

void main()
{
    // pattern 4
    float strength = 1.0 - vUv.y;

    gl_FragColor = vec4(vec3(strength), 1.0);
}