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

### Uniforms
- Data that does not change for each vertex
- Transformations, lighting, camera sometimes etc

Once the GPU has processed the Vertex Shader, it knows what parts of the geometry are visible and what parts are not.

The data is then sent to the Fragment Shader.

## Fragment Shader

Does not use attributes as it is only concerned with the pixel it is rendering.

It can accept varying from the vertex shader, which are interpolated values between the vertices. For example - Mixtures of colors between vertices.


