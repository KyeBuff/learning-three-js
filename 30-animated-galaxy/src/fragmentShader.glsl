varying vec3 vColor;

void main()
{

    // check the distance between the x,y vec2 pos vs the middle point of the plane (0.5, 0.5)
    float strength = distance(gl_PointCoord, vec2(0.5));

    // create a cut off point at 0.5
    // drawing a disc
    // strength = step(0.5, strength);

    // linear diffusion
    // strength *= 2.0;

    strength = 1.0 - strength;

    // Light point pattern
    // curved diffusion
    strength = pow(strength, 10.0);

    gl_FragColor = vec4(vColor, strength);

    #include <colorspace_fragment>
}
