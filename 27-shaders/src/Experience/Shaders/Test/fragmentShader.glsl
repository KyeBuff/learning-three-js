precision mediump float;

varying float vDeviations;
    
void main()
{
    gl_FragColor = vec4(vDeviations * .8, vDeviations * .1, vDeviations, 1.0);
}