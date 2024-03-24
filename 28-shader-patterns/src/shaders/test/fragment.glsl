varying vec2 vUv;


// Left to right - black to white
// void main()
// {
//     gl_FragColor = vec4(vUv.x, vUv.x, vUv.x, 1.0);
// }


// bottom to top - white to black
// void main()
// {
//     float method = 1.0 - vUv.y;
//     gl_FragColor = vec4(vec3(method), 1.0);
// }


// top to bottom - black to whie, fast transition at the end due to multiplication of 10 increasing amplitude
// e.g. starting from bottom 0 * 10 is 0, 0.0001 * 10 is 0.001 etc but this ramps up
// void main()
// {
//     float method = vUv.y * 10.0;
//     gl_FragColor = vec4(vec3(method), 1.0);
// }


// top to bottom - black to white, restart transition after each 10th of render
// void main()
// {

//     float method = mod(vUv.y * 10.0, 1.0);
//     gl_FragColor = vec4(vec3(method), 1.0);
// }

// more abrupt change between colours
void main()
{

    float method = mod(vUv.y * 10.0, 1.0);
    // method = floor(method + 0.5);
    // step function is a function that returns 0 if the first argument is less than the second, and 1 otherwise
    method = step(0.5, method);
    gl_FragColor = vec4(vec3(method), 1.0);
}

