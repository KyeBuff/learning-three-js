# 27 Shaders

- First thing you learn when doing WebGL
- Main component of WebGL
- They are written in GLSL (OpenGL Shading Language)
- They are executed on the GPU
- They render each vertex 
- Another shader then renders each pixel (fragment really as a render unit can be more or less than one pixel) colour

THREEJS uses shaders with it's materials. Using custom shaders are more performant and:
- Can be used to create custom effects
- Can be used to create custom materials
- Can be used to create custom post-processing effects

Data sent to the shader includes:
- Vertices coordinates
- Transform information
- Camera information
- Lighting
- Colors
- Textures
etc

GPU processes this data and applies the shader instructions.

# Types of shaders

## Vertex Shader
Responsible for positioning vertices in 3D space.

We send the vertex shader the data required to do so which then sends this onwards to the GPU.

GPU executes the shader instructions and renders the verteces.

### Attributes
- Data that is different for each vertex
- Position, color, texture coordinates, etc

#### Passing from 3JS to Shader
- BufferAttributes are passed to the shader as an attribute value which can read
- A single element in the attributes buffer is passed not the whole thing and it is for each corresponding vertex
- You can then use this value to affect position etc

Example - create spikes on a plane using random values in a float 32 array 

### Uniforms
- Data that does not change for each vertex
- Transformations, lighting, camera sometimes etc

Once the GPU has processed the Vertex Shader, it knows what parts of the geometry are visible and what parts are not.

The data is then sent to the Fragment Shader.

## Fragment Shader

Does not use attributes as it is only concerned with the pixel it is rendering.

It can accept varying from the vertex shader, which are interpolated values between the vertices. For example - Mixtures of colors between vertices.


### Precision variable 
- Required for the `RawShaderMaterial`
- Affects performance 
- Can be low, medium or high p

```c
precision mediump float
```

### Varying 

Varying vars are sent from the Vertex to Fragment Shader. Fragment Shader cannot just read the attributes so we send them from the vertex shader as varying.

Define the varying on the Vertex shader, assign it a value and then define it on the Fragment Shader and use it.

```c
varying vRandom float;

gl_FragColor = vec4(vRandom, 1.0, 0.5, 1.0);
```

This is a color for each vertex, of which there are 3 to vertices. Values are interpolated to create a gradient like effect between each vertex.