import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import GUI from 'lil-gui'

/****
 * 
 * Particle rendering, GPU renders in same order as creation which can create alpha/z-index issues if something is rendered infront of another particle that was created at a different time
 * 
 * There is a known issue with WebGL rendeiring particles and determining what sits above what when using an alpha map on a particle material.

WebGL stores the info in a depth buffer and this can be buggy and produce wrong results.

You can apply an alphaTest to a material to change the threshold at which the GPU discards pixels on a material. E.g. 0.001 will not render a pixel if alpha is less than that. Which can leave a borde if the alpha map has blended edges.

You can set depthTest to false, which tells the GPU to stop trying to work it out but this will not work if particles use different colours or there are other object's in the scene as particles will render even if they are behind an object.

Disabling depthWrite disables the buffer for depth tests and resolves the issue almost perfectly. 

Performance is not an issue.

Blending 

You can also change the blend mode of the material which affects performance. In conjuction with disabling depthWrite you can determine how particles blend with each other.

E.g. additive blending combines / adds the blended colours increasing the intensity

Vertex colors

Applying a custom colour to each vertex can be done with a "color" buffer attribute and using RGB. 

The scale of RGB is between 0 and 1 as a float.

E.g. you can use rand() to generate a random color

You must set vertexColors to true on the material if doing this.
 */

/**
 * Base
 */
// Debug
const gui = new GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()

const texture = textureLoader.load('/textures/particles/2.png');

/**
 * Test cube
 */

const randomGeometry = new THREE.BufferGeometry();
const count = 20000;
const positions = new Float32Array(count * 3);
const colors = new Float32Array(count * 3);

for (let index = 0; index < count * 3; index++) {
    positions[index] = (Math.random() - 0.5) * 10;

    colors[index] = Math.random();
}

const positionsAttribute = new THREE.BufferAttribute(positions, 3);
const colorsAttribute = new THREE.BufferAttribute(colors, 3);

randomGeometry.setAttribute('color', colorsAttribute)
randomGeometry.setAttribute('position', positionsAttribute)

const random = new THREE.Points(
    randomGeometry,
    new THREE.PointsMaterial({
        size: 0.02,
        sizeAttenuation: true,
        alphaMap: texture,
        // alphaTest: 0.001,
        // depthTest: false,
        depthWrite: false,
        transparent: true,
        vertexColors: true,
    })
)

scene.add(random)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.z = 3
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()