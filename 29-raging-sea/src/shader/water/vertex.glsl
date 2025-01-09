
varying float vElevation;
uniform float uTime;
uniform float uWaveElevation;
uniform vec2 uWaveFrequency;
uniform float uWaveSpeed;
        
void main()
{
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);

    float frequency = 1.8;

    float waveSpeed = uTime * uWaveSpeed;

    float elevation = sin(modelPosition.x * uWaveFrequency.x + waveSpeed);
    elevation *= sin(modelPosition.z * uWaveFrequency.y + waveSpeed);
    elevation *= uWaveElevation;

    modelPosition.y += elevation;

    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;


    gl_Position = projectedPosition;

    vElevation = elevation;
}