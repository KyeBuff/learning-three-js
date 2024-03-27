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
// void main()
// {

//     float method = mod(vUv.y * 10.0, 1.0);
//     // method = floor(method + 0.5);
//     // step function is a function that returns 0 if the first argument is less than the second, and 1 otherwise
//     method = step(0.75, method);
//     gl_FragColor = vec4(vec3(method), 1.0);
// }

// Pattern 11 - drawing a crossover grid

// void main()
// {
//     // 0.1 * 10 = 1 % 1 = 0
//     // We are drawing .25 for each tenth of the grid
//     // 0.1 - 0.25 is the first white line where the value is 1.0
//     // Remember this is for each fragment of the grid, it is not a loop
//     // I get stuck when I think it's a looping construct

//     float colorStrengthX = mod(vUv.x * 10.0, 1.0);
//     float colorStrengthY = mod(vUv.y * 10.0, 1.0);
//     float colorStrength = step(0.75, colorStrengthX) + step(0.75, colorStrengthY);
//     gl_FragColor = vec4(vec3(colorStrength), 1.0);
// }


// Pattern 12 - drawing a square grid
// void main()
// {

//     // We get the modulo value of Y based on a 10th of the grid
//     // We check if that value is greater than 0.8 (same threshold as the X step)
//     // To draw a small square
//     // We multiply the X step by the Y step to get the intersection of the two
//     float staggeredY = step(
//         0.75, 
//         mod(vUv.y * 10.0, 1.0)
//     );

//     // Because for the bottom corner X is 0
//     // 0 * 10 = 0 % 1 = 0 multiplied by staggeredY which is 0 at the bottom
//     // We therefore actually get a black bottom left corner and it is only when we reach a higher step value than 0.75 that we get a white square

//     // Second square X 0.8 * 10 = 8 % 1 = 0.8
//     // 0.8 is greater than 0.75 so we get a white X value
//     // multipled by staggeredY - which is only above .75 at the top, it creates a value of at least 1.0
//     // All other values are 0
//     float colorStrength = step(0.75, mod(vUv.x  * 10.0, 1.0)) * staggeredY;
    
//     gl_FragColor = vec4(vec3(colorStrength), 1.0);
// }

// Pattern 13 - drawing a square grid with a right angle
// void main()
// {

//     // We get the modulo value of Y based on a 10th of the grid
//     // We check if that value is greater than 0.8 (same threshold as the X step)
//     // To draw a small square
//     // We multiply the X step by the Y step to get the intersection of the two
//     float staggeredY = step(
//         0.75, 
//         mod(vUv.y * 10.0, 1.0)
//     );

//     // To create the right angle, we change the step threshold of X (futher right) and multiply that by a large Y threshold so that we draw lower in the grid
//     float barY = step(0.75, mod(vUv.x  * 10.0, 1.0)) * step(
//         0.33, 
//         mod(vUv.y * 10.0, 1.0)
//     );

//     float barX = step(0.33, mod(vUv.x  * 10.0, 1.0)) * staggeredY;

//     // Because for the bottom corner X is 0
//     // 0 * 10 = 0 % 1 = 0 multiplied by staggeredY which is 0 at the bottom
//     // We therefore actually get a black bottom left corner and it is only when we reach a higher step value than 0.75 that we get a white square

//     // Second square X 0.8 * 10 = 8 % 1 = 0.8
//     // 0.8 is greater than 0.75 so we get a white X value
//     // multipled by staggeredY - which is only above .75 at the top, it creates a value of at least 1.0
//     // All other values are 0
//     float colorStrength = barX + barY;
    
//     gl_FragColor = vec4(vec3(colorStrength), 1.0);
// }

// Pattern drawing plus signs
// Here we just offset the staggeredY and barY X and Y values by 0.02

// void main()
// {

//     // We get the modulo value of Y based on a 10th of the grid
//     // We check if that value is greater than 0.8 (same threshold as the X step)
//     // To draw a small square
//     // We multiply the X step by the Y step to get the intersection of the two
//     float staggeredY = step(
//         0.75, 
//         mod((vUv.y + 0.02) * 10.0, 1.0)
//     );

//     // To create the right angle, we change the step threshold of X (futher right) and multiply that by a large Y threshold so that we draw lower in the grid
//     float barY = step(0.75, mod((vUv.x + 0.02)   * 10.0, 1.0)) * step(
//         0.33, 
//         mod(vUv.y * 10.0, 1.0)
//     );

//     float barX = step(0.33, mod(vUv.x  * 10.0, 1.0)) * staggeredY;

//     // Because for the bottom corner X is 0
//     // 0 * 10 = 0 % 1 = 0 multiplied by staggeredY which is 0 at the bottom
//     // We therefore actually get a black bottom left corner and it is only when we reach a higher step value than 0.75 that we get a white square

//     // Second square X 0.8 * 10 = 8 % 1 = 0.8
//     // 0.8 is greater than 0.75 so we get a white X value
//     // multipled by staggeredY - which is only above .75 at the top, it creates a value of at least 1.0
//     // All other values are 0
//     float colorStrength = barX + barY;
    
//     gl_FragColor = vec4(vec3(colorStrength), 1.0);
// }

// Pattern 17 - cross
// As we are using abs() we are getting .5 and .5 for both in the corners creating white colours
// in the middle and in the crossover (+), we are seeing black as at least one value is 0

// void main()
// {
//     // float value = abs(vUv.x - 0.5) * abs(vUv.y - 0.5) * 3.0;

//     float value = min(abs(vUv.x - 0.5), abs(vUv.y - 0.5));
//     gl_FragColor = vec4(vec3(value), 1.0);
// }
// Pattern 18 - inverted
// void main()
// {
//     // float value = abs(vUv.x - 0.5) * abs(vUv.y - 0.5) * 3.0;

//     float value = max(abs(vUv.x - 0.5), abs(vUv.y - 0.5));
//     gl_FragColor = vec4(vec3(value), 1.0);
// }

// Pattern 19 - inner box
//   0.2
//  |  |
// ######
// ##  ## -- 0.2
// ##  ## -- 0.2
// ######
//  |  |
//   0.2

// Step function leads to the inner box by testing if the maximum offset X or Y value is less than 0.2
void main()
{
    // float value = abs(vUv.x - 0.5) * abs(vUv.y - 0.5) * 3.0;

    float value = step(0.2, max(abs(vUv.x - 0.5), abs(vUv.y - 0.5)));
    gl_FragColor = vec4(vec3(value), 1.0);
}