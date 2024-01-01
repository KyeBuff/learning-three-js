
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import GUI from 'lil-gui'

/**
 * Base
 */
// Debug

// Canvas
const canvas = document.querySelector('canvas.webgl')

const gui = new GUI();

// Scene
const scene = new THREE.Scene()

const parameters = {
    radius: 2,
    addRings: false
}

/**
 * Objects
 */

const addRings = () => {
    // create a points mesh for particles
    // generate a loop which builds a positions buffer attribute
    // use this loop to create colours
    // use radius + x to create space around the sphere

    const count = 100000;

    const positions = new Float32Array( count * 3 )

    for (let index = 0; index < count; index++) {
        const i3 = index * 3;

        const radius = Math.random() > 0.5 ? parameters.radius + 1 : -(parameters.radius + 1);
        const negativeRadius = radius < 0;
        const branch = index % 16;

        const x = negativeRadius ? radius - Math.random() : radius + Math.random();
        const z = negativeRadius ? radius - Math.random() : radius + Math.random();

        positions[i3] = Math.sin(x + branch) * 4;
        positions[i3 + 1] = 0;
        positions[i3 + 2] = Math.cos(z + branch) * 4;
    }

    const positionAttribute = new THREE.BufferAttribute(positions, 3);

    const ringGeometry = new THREE.BufferGeometry();
    ringGeometry.setAttribute('position', positionAttribute);

    const ringMaterial = new THREE.MeshBasicMaterial();

    const rings = new THREE.Points(ringGeometry, ringMaterial)

    scene.add(rings);
}

let planet = null;
let planetMaterial = null;

const generatePlanet = () => {
    if (planet) {
        planetMaterial.dispose();
        scene.remove(planet);
    }

    planetMaterial = new THREE.MeshStandardMaterial({
        color: 'white'
    });

    planet = new THREE.Mesh(
        new THREE.SphereGeometry(parameters.radius),
        planetMaterial
    )
    
    scene.add(planet);

    addRings();
}


const directionalLight = new THREE.DirectionalLight(
    'white',
    2
)

directionalLight.position.y = 2
directionalLight.position.x = 4

const ambientLight = new THREE.AmbientLight(
    'white',
    0.1
)
scene.add(ambientLight);


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
camera.position.z = 5;
camera.position.y = 1;
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

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()

generatePlanet();

gui.add(parameters, 'radius').min(1).max(3).step(0.01).onFinishChange(generatePlanet)
gui.add(parameters, 'addRings').onFinishChange(addRings)
