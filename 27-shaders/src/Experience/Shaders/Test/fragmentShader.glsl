precision mediump float;
precision mediump float;

uniform sampler2D uTexture;

varying vec2 vUv;
    
// varying float vDeviations;
// void main()
// {
//     gl_FragColor = vec4(vDeviations * .8, vDeviations * .1, vDeviations, 1.0);
// }
// uniform vec3 uColor;

    
void main()
{
    vec4 texture = texture2D(uTexture, vUv);

    gl_FragColor = texture;
}