# 27 Shaders

## Resources
- [The Book of Shaders](https://thebookofshaders.com/)
- [GLSL Sandbox](http://glslsandbox.com/)
- [Shadertoy](https://www.shadertoy.com/)
- [Shaderific](https://shaderific.com/glsl.html)
- [Kronos GLSL Reference](https://www.khronos.org/registry/OpenGL-Refpages/gl4/html/indexflat.php)

- First thing you learn when doing WebGL
- Main component of WebGL
- They are written in GLSL (OpenGL Shading Language)
- They are executed on the GPU
- They render each vertex 
- Another shader then renders each pixel (fragment really as a render unit can be more or less than one pixel) colour
- Shaders need subdivision as this creatres more vertices and therefore more pixels to render

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

#### Using Uniforms
- Pass from JS to Shader
- The variable changes and this is immediately reflected in the render
- You can use this to create a wave effect on a plane

You pass them to the material like:
```js
const material = new THREE.ShaderMaterial({
    uniforms: {
        time: { value: 0 }
    }
});
```

Then you can use them in the shader like:
```c
uniform float time;
```

### Usage 
- main function is called automatically 
- gl_Position is a built-in variable that is used to set the position of the vertex
    - It is a vec4
- Even though the vertex coordinates do not need 4 values, it is required as it is stored in clip space
    - Clip space lets us render inside of a cube, using XYZ and W
    - W is used to determine the vertex perspective

```c
void main()
{
    gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.0);
}
```

#### Position
- position is a built-in attribute that is used to set the position of the vertex
    - it is the glsl method creating a position attribute with 3JS
    - it is a vec3
    - It is used in the above example
    - Contains the vertex coordinates

```c
attribute vec3 position;

void main()
{
    // position is coerced into a vec4, where 1.0 is the value for w
    gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.0);
}
```

#### Matrices
- projectionMatrix, viewMatrix, modelMatrix are built-in uniforms that are used to set the position of the vertex
    - They are used to transform the vertex coordinates to clip space
    - They are used in the above example

They are uniform because they do not change for each vertex.

To apply a matrix you always multiply by it.

As we are using a vec4, we need to use mat4 to multiply by it, this stands for a 4x4 matrix as oppose to a 3x3 matrix for vec3.

```c
uniform mat4 projectionMatrix;
uniform mat4 viewMatrix;
uniform mat4 modelMatrix;

attribute vec3 position;

##### modelMatrix
- Relative to the Mesh
- Transforms the mesh
- Used to position, scale and rotate the mesh

##### viewMatrix
- Relative to the Camera
- Transforms the camera
- Used to position, rotate the camera, change FOV, near and far planes

##### projectionMatrix
- Relative to the Scene
- Transforms the coordinates into clip space coordinates
- This makes sense as we call updateProjectionMatrix on the camera when we change the aspect ratio

// The calculation works out the position of the vertex in clip space
void main()
{
    gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.0);
}
```

### Refactored

We gain more control by separating the effects of the different matrices.

```c
uniform mat4 projectionMatrix;
uniform mat4 viewMatrix;
uniform mat4 modelMatrix;

attribute vec3 position;

void main()
{
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectionPosition = projectionMatrix * viewPosition;
    gl_Position = projectionPosition;
}
```

Using the above code, we can affect the Mesh position, scale or rotation by changing the modelMatrix alone. For example, we can create a wave effect like so:

```c
// x value increases from left to right so produces a different value from sin() for each vertex

modelPosition.z += sin(modelPosition.x * 10.0) * 0.1;
```

## Fragment Shader

Does not use attributes as it is only concerned with the pixel it is rendering.

It can accept varying from the vertex shader, which are interpolated values between the vertices. For example - Mixtures of colors between vertices.

# GLSL - OpenGL Shading Language

- Based on C

## Data Types
- int
- float
- bool
- vec2, vec3, vec4

GLSL uses strict typing so you cannot mix types.

# Int to Float conversion
- You can convert an int to a float by calling float() on the int

```c
int a = 2;
float b = 1.3 * float(a);
```

# Vec[n]
- You can multiply a vec[n] by a float or another vec[n] and it will multiply each property of the float
- It returns an object where you can update properties like:
    - vec3(1, 2, 3).x = 4

- RGB is a vec3
    - You can name the properties of a vec3 like r, g, b if you like but it is not necessary, you can use x, y, z - they are aliases of each other
    - RGBA is a vec4

- You can merge vec2s into vec3s:
```c
vec3 foo = vec3(vec2(1, 2), 3);
```
- You can extract a vec2 from a vec3, this is known as swizzling:
```c
vec2 bar = foo.xy;
```

## Vec4
- You can use vec4 to store a color
- You can use vec4 to store a position in 3D space
- You can use vec4 to store a texture coordinate

4th property is either a (alpha) or w (for position)

# Functions
- You can define your own functions
- You can use built-in functions
- You can use built-in functions to create your own functions

```c
float fooBar(int a, int b) {
    return float(a + b);
}

float baz = fooBar(1, 2);
```

If your function is not returning a value, you can use void as the return type.

```c
void fooBar(int a, int b) {
    float c = float(a + b);
}
```
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


# Textures

- Loaded in with texture loader
- Passed to the fragment shader as a uniform sampler2D type
- texture2D() called with first argument as uTexture
    - Second argument is the texture coordinates (these are the UV coordinates of the geometry) and are passed from the vertex shader to the fragment shader as varying
    - This maps the colour from the texture to the geometry as the UV coordinates contain the values required to do so

<!-- In vertex shader -->
```c
varying vec2 vUv;

void main() {
    vUv = uv;
}
```

<!-- In fragment shader -->
```c
uniform sampler2D uTexture;
varying vec2 vUv;

void main() {
    gl_FragColor = texture2D(uTexture, vUv);
}
```

In 3JS

```js
const texture = new THREE.TextureLoader().load('path/to/texture.jpg');
const material = new THREE.ShaderMaterial({
    uniforms: {
        uTexture: { value: texture }
    }
});
```

# Benefits of ShaderMaterial vs Raw

You can remove the following uniform and attribute and precision in both shaders:

uniform mat4 projectionMatrix;
uniform mat4 viewMatrix;
uniform mat4 modelMatrix;
attribute vec3 position;
attribute vec2 uv;
precision mediump float;

They are automatically added by the ShaderMaterial.