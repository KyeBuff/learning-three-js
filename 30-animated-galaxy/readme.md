# Size attenuation

```c
    gl_PointSize *= (1.0 / - viewPosition.z);
```

The above code snippet is pulled from 3JS shaders with 1.0 replacing a `scale` var. Pulled from [ShaderLib/points.glsl.js](node_modules/three/src/renderers/shaders/ShaderLib/points.glsl.js)

# Fragment Shader

Each vertex as a particle is it's own plane so we do not have uv coordinates to pass. 1` gl_PointCoord` is a vec2 which holds the x and y value but operates a different cartesian plane, where the white occurs at the bottom right corner of the plane.

## Drawing a cirlce with fragment shader.

```c
    float strength = distance(gl_PointCoord, vec2(0.5));

    // 0.5 below is our radius
    strength = step(0.5, strength);

    // distance between the points near the center will be < 0.5 and the step function will return 0.0, thefore to create more color in the center we will subtract the strength (0.0 for those in radius) from 1.0
    strength = 1.0 - strength;

    gl_FragColor = vec4(vec3(strength), 1.0);
```

# Light point pattern
Using power / squaring floats to create a light point pattern. High light concentration in the center and low light concentration at the edges.

```c
    float strength = distance(gl_PointCoord, vec2(0.5));
    strength = 1.0 - strength;

    // 2.0 is the power
    strength = pow(strength, 2.0);

    gl_FragColor = vec4(vec3(strength), 1.0);
```