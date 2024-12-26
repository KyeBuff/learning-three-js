varying vec2 vUv; // varying allows us to share data between the vertex and fragment shaders 

void main()
{
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    
    // e.g. we are auto receiving the uv attribute from the geometry here and passing it to the fragment shader
    vUv = uv;
}