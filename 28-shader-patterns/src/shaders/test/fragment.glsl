varying vec2 vUv; // varying allows us to share data between the vertex and fragment shaders 

// pi
#define PI 3.14159265359

void main()
{
    // pattern 6
    // float strength = vUv.y * 10;

    // pattern 7
    // float strength = mod(vUv.y * 10.0, 1.0);

    // pattern 8

    // step function returns 0.0 if the first argument is less than the second, and 1.0 otherwise
    // float strength = step(0.5, mod(vUv.y * 10.0, 1.0));

    // pattern 9
    // float strength = step(0.85, mod(vUv.y * 10.0, 1.0));

    // pattern 11
    // float strength = step(0.85, mod(vUv.x * 10.0, 1.0));
    // strength += step(0.85, mod(vUv.y * 10.0, 1.0));
    // if you want to overlap an X and Y pattern, you can add the values together

    // pattern 12
    // float strength = step(0.85, mod(vUv.x * 10.0, 1.0));
    // strength *= step(0.85, mod(vUv.y * 10.0, 1.0));

    // pattern 13
    // float strength = step(0.4, mod(vUv.x * 10.0, 1.0));
    // strength *= step(0.85, mod(vUv.y * 10.0, 1.0));

    // pattern 14

    // float strengthX = step(0.4, mod(vUv.x * 10.0, 1.0));
    // strengthX *= step(0.85, mod(vUv.y * 10.0, 1.0));

    // float strengthY = step(0.4, mod(vUv.y * 10.0, 1.0));
    // strengthY *= step(0.85, mod(vUv.x * 10.0, 1.0));

    // float strength = strengthX + strengthY;

    // pattern 15
    // float strengthX = step(0.4, mod(vUv.x * 10.0, 1.0));
    // strengthX *= step(0.85, mod(vUv.y * 10.0 + .2, 1.0));

    // float strengthY = step(0.4, mod(vUv.y * 10.0, 1.0));
    // strengthY *= step(0.85, mod(vUv.x * 10.0 + .2, 1.0));

    // float strength = strengthX + strengthY;

    // pattern 16
    // float strength = abs(0.5 - vUv.x);

    // pattern 17
    // float strengthY = abs(0.5 - vUv.y);

    // float strengthX = abs(0.5 - vUv.x);

    // float strength = min(strengthX, strengthY);

    // pattern 18
    // float strength = max(strengthX, strengthY);


    gl_FragColor = vec4(vec3(strength), 1.0);
}