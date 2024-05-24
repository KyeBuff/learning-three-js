varying vec2 vUv;
uniform float uTime;

// A constant
#define PI 3.14159265359

float random(vec2 st)
{
    return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
}

vec2 rotate(vec2 uv, float rotation, vec2 mid)
{
    return vec2(
      cos(rotation) * (uv.x - mid.x) + sin(rotation) * (uv.y - mid.y) + mid.x,
      cos(rotation) * (uv.y - mid.y) - sin(rotation) * (uv.x - mid.x) + mid.y
    );
}

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

// Pattern 19/20 - inner box
//   0.2
//  |  |
// ######
// ##  ## -- 0.2
// ##  ## -- 0.2
// ######
//  |  |
//   0.2

// Step function leads to the inner box by testing if the maximum offset X or Y value is less than 0.2
// void main()
// {
//     // float value = abs(vUv.x - 0.5) * abs(vUv.y - 0.5) * 3.0;

//     // 19 - float value = step(0.4, max(abs(vUv.x - 0.5), abs(vUv.y - 0.5)));

//     // 20 - float value = step(0.4, max(abs(vUv.x - 0.5), abs(vUv.y - 0.5)));

//     // 20.b: the way Bruno did it which is more accurate as the square was in the middle of the mesh
//     // We create two squares, one with a 0.25 offset and the other with a 0.2 offset
//     // The squares have a small intersection due to the 0.25 value of square one's step
//     // float squareOne = 1.0 - step(0.25, max(abs(vUv.x - 0.5), abs(vUv.y - 0.5)));
//     // float squareTwo = step(0.2, max(abs(vUv.x - 0.5), abs(vUv.y - 0.5)));

//     // // We can multiply the squares to only render the intersection
//     // // This make sense as both squares intersections will be there highest value and so multiplying them will only render the intersection
//     // float value = squareOne * squareTwo;
//     // gl_FragColor = vec4(vec3(value), 1.0);

// }

// Pattern 21 and 22 - diagonal square grid

// When we want to combine X and Y effects, we can multiply them

// void main()
// {
//     // 0.1 * 10 = 1 / 10 = 0.1
//     // 0.2 * 10 = 2 / 10 = 0.2
//     float floorX = floor(vUv.x * 10.0);
//     float floorY = floor(vUv.y * 10.0);
//     float value = floorX / 10.0 * floorY / 10.0;
//     gl_FragColor = vec4(vec3(value), 1.0);
// }

// Pattern 23 - old TV broken screen

// void main()
// {   
// //     // 0.1 * 10 = 1 / 10 = 0.1
// //     // 0.2 * 10 = 2 / 10 = 0.2
//     float floorX = floor(vUv.x * 10.0);
//     float floorY = floor(vUv.y * 10.0);
//     float value = floorX / 10.0 * floorY / 10.0;

//     // Re-use flooring grid code from previous exercise
//     vec2 st = vec2(floorX / 10.0, floorY / 10.0);
//     // Create a vec2 for random using the same value twice to create a small square
//     // As the values are floored to the same in the same, we can call random (as it's a pure function which retuns the same value for the same input)

//     gl_FragColor = vec4(vec3(random(st)), 1.0);
// }

// Offset diagonal grid
// void main()
// {   
// //     // 0.1 * 10 = 1 / 10 = 0.1
// //     // 0.2 * 10 = 2 / 10 = 0.2
//     float floorX = floor(vUv.x * 10.0);
//     float floorY = floor((vUv.y + vUv.x / 2.0) * 10.0);
    
//     // Re-use flooring grid code from previous exercise
//     vec2 st = vec2(floorX / 10.0, floorY / 10.0);
//     // Create a vec2 for random using the same value twice to create a small square
//     // As the values are floored to the same in the same, we can call random (as it's a pure function which retuns the same value for the same input)

//     gl_FragColor = vec4(vec3(random(st)), 1.0);
// }

// Pattern 25

// length() is a function that returns the length of a vector
// In this case, we are using the UV coordinates as a vector
// The length of the vector is the distance from the bottom left corner of the screen
// The distance is calculated by the Pythagorean theorem
// The length of the vector is the square root of the sum of the squares of the two sides


// Pattern 27 - 28 - 29
// void main()
// {
    // gl_FragColor = vec4(vec3(pow(vUv.y * .75, 1.0 - vUv.x)), 1.0);

    // Length() returns distance from the bottom left corner vec2(0.0, 0.0)
    // gl_FragColor = vec4(vec3(length(vUv)), 1.0);

    // Distance() returns distance between two points
    // So here we draw a circle from the middle
    // gl_FragColor = vec4(vec3(length(vUv - 0.5)), 1.0);
    // or
    // gl_FragColor = vec4(vec3(distance(vUv, vec2(0.5, 0.5)) * 2.0), 1.0);

    // reversed 

    // gl_FragColor = vec4(vec3(1.0 - distance(vUv, vec2(0.5))), 1.0);

    // 29 smaller cirlce, more like a sun

    // Had some fun with sin and elapsed time

    // float strength = sin(uTime) / 25.0;

    // gl_FragColor = vec4(vec3(
    //     strength / distance(vUv, vec2(0.5))
    // ), 1.0);

    // Cool space-like pattern 
    // gl_FragColor = vec4(vec3(
    //     0.025 / distance(vUv, vec2(0.5)) - abs(vUv.y - 0.5) * 10.0
    // ), 1.0);


void main()
{
    // 30 
    // vec2 adjustedVec = vec2(
    //     vUv.x * .1 + 0.45, 
    //     vUv.y * 0.5 + 0.25
    // );

    // gl_FragColor = vec4(vec3(
    //     0.015 / distance(adjustedVec, vec2(0.5))
    // ), 1.0);

    // 31
    // vec2 lightUvX = vec2(
    //     vUv.x * .1 + 0.45, 
    //     vUv.y * 0.5 + 0.25
    // );
    // float lightX = 0.015 / distance(lightUvX, vec2(0.5));

    // vec2 lightUvY = vec2(
    //     vUv.y * .1 + 0.45, 
    //     vUv.x * 0.5 + 0.25
    // );
    // float lightY = 0.015 / distance(lightUvY, vec2(0.5));

    // float strength = lightX * lightY;

    // gl_FragColor = vec4(strength, strength, strength, 1.0);

 
    // 32

    vec2 rotatedUv = rotate(vUv, PI * .25, vec2(0.5));

    vec2 lightUvX = vec2(
        rotatedUv.x * .1 + 0.45, 
        rotatedUv.y * 0.5 + 0.25
    );
    float lightX = 0.015 / distance(lightUvX, vec2(0.5));

    vec2 lightUvY = vec2(
        rotatedUv.y * .1 + 0.45, 
        rotatedUv.x * 0.5 + 0.25
    );
    float lightY = 0.015 / distance(lightUvY, vec2(0.5));

    float strength = lightX * lightY;

    gl_FragColor = vec4(strength, strength, strength, 1.0);



}