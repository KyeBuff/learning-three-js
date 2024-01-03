
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import GUI from 'lil-gui'

/**
 * Base
 */

// Textures
const textureLoader = new THREE.TextureLoader();

// Canvas
const canvas = document.querySelector('canvas.webgl')

const gui = new GUI();

// Scene
const scene = new THREE.Scene()

const parameters = {
    color: '#f49a34',
    radius: 2,
    addRings: true,
    ringColorOne: '#28ccc1',
    ringColorTwo: '#3300FF'
}

const planetContainer = new THREE.Group();
planetContainer.rotateZ(0.1)

/**
 * Objects
 */

let rings = null;
let ringMaterial = null;

const addRings = () => {
    if (rings) {
        ringMaterial.dispose();
        planetContainer.remove(rings);
    }
    if (!parameters.addRings) {
        return false;
    }
    const count = 100000;

    const positions = new Float32Array( count * 3 )
    const colors = new Float32Array( count * 3 )

    const insideColor = new THREE.Color(parameters.ringColorOne);
    const outsideColor = new THREE.Color(parameters.ringColorTwo);

    for (let index = 0; index < count; index++) {
        const i3 = index * 3;

        const radius = Math.random() > 0.5 ? parameters.radius + 1 : -(parameters.radius + 1);

        positions[i3] = Math.sin(index) * radius + (Math.random() - 0.5);
        positions[i3 + 1] = 0;
        positions[i3 + 2] = Math.cos(index) * radius + (Math.random() - 0.5);

        const blendedColor = insideColor.clone().lerp(outsideColor, index / count)

        colors[i3] = blendedColor.r;
        colors[i3 + 1] = blendedColor.g;
        colors[i3 + 2] = blendedColor.b;
    }

    const positionAttribute = new THREE.BufferAttribute(positions, 3);
    const colorAttribute = new THREE.BufferAttribute(colors, 3);

    const ringGeometry = new THREE.BufferGeometry();
    ringGeometry.setAttribute('position', positionAttribute);
    ringGeometry.setAttribute('color', colorAttribute);

    ringMaterial = new THREE.PointsMaterial({
        size: 0.01,
        sizeAttenuation: true,
        blending: THREE.AdditiveBlending,
        vertexColors: true,
    });

    rings = new THREE.Points(ringGeometry, ringMaterial)

    planetContainer.add(rings);
}

let planet = null;
let planetMaterial = null;

const generatePlanet = () => {
    if (planet) {
        planetMaterial.dispose();
        planetContainer.remove(planet);
    }

    planetMaterial = new THREE.MeshStandardMaterial({
        color: parameters.color,
    });

    planet = new THREE.Mesh(
        new THREE.SphereGeometry(parameters.radius),
        planetMaterial
    )
    
    planetContainer.add(planet);

    addRings();
}


const directionalLight = new THREE.DirectionalLight(
    'white',
    2
)

directionalLight.position.y = 2
directionalLight.position.x = 4
directionalLight.position.z = 2

const ambientLight = new THREE.AmbientLight(
    'white',
    0.05
)
scene.add(planetContainer, ambientLight, directionalLight);


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

    planetContainer.rotation.y = elapsedTime * .1

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()

generatePlanet();

gui.addColor(parameters, 'color').onChange(generatePlanet)
gui.add(parameters, 'radius').min(1).max(3).step(0.01).onFinishChange(generatePlanet)
gui.add(parameters, 'addRings').onFinishChange(addRings)
gui.addColor(parameters, 'ringColorOne').onChange(addRings)
gui.addColor(parameters, 'ringColorTwo').onChange(addRings)
