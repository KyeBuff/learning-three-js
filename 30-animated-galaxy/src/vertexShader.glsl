
uniform float uPointSize;

attribute float aScale;

varying vec3 vColor;

void main()
{

    // Position
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectionPosition = projectionMatrix * viewPosition;

    gl_Position = projectionPosition;

    gl_PointSize = uPointSize * aScale;

    // size attenuation
    gl_PointSize *= (1.0 / - viewPosition.z);

    // Color
    vColor = color;

}