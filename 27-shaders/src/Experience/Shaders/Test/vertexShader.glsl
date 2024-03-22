uniform vec2 uFrequency;
uniform float uTime;

varying vec2 vUv;
varying float vElevation;

void main()
{
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
    modelPosition.z += sin(modelPosition.x * uFrequency.x - uTime) * 0.05;
    modelPosition.z += sin(modelPosition.y * uFrequency.y  - uTime) * 0.05;
    vElevation = modelPosition.z;

    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;
    
    gl_Position = projectedPosition;
    vUv = uv;
}

// uniform mat4 projectionMatrix;
// uniform mat4 viewMatrix;
// uniform mat4 modelMatrix;

// attribute vec3 position;
// attribute float aDeviations;

// varying float vDeviations;

// void main()
// {
//     vec4 modelPosition = modelMatrix * vec4(position, 1.0);
//     modelPosition.z += aDeviations * .1;
//     vec4 viewPosition = viewMatrix * modelPosition;
//     vec4 projectedPosition = projectionMatrix * viewPosition;

//     vDeviations = aDeviations;
    
//     gl_Position = projectedPosition;
// }