import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import GUI from 'lil-gui'

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
 * Galaxy
 */


const parameters = {
    count: 100000,
    size: 0.01
}

let galaxyMaterial = null;
let galaxyGeometry = null;
let galaxy = null;

const generateGalaxy = () => {
    if (galaxy) {
        galaxyMaterial.dispose();
        galaxyGeometry.dispose();
        scene.remove(galaxy);
    }

    const positions = new Float32Array(parameters.count * 3);

    for (let index = 0; index < parameters.count; index++) {
        // we loop only 10000 times to cover the 30000 xyz values that we need to create for the particles
        const i3 = index * 3;

        positions[i3] = Math.random();
        positions[i3 + 1] = Math.random();
        positions[i3 + 2] = Math.random();
    }

    const positionsAttribute = new THREE.BufferAttribute(positions, 3);

    galaxyGeometry = new THREE.BufferGeometry();
    galaxyGeometry.setAttribute('position', positionsAttribute);

    galaxyMaterial = new THREE.PointsMaterial({
        size: parameters.size,
        sizeAttenuation: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending
    });

    galaxy = new THREE.Points(galaxyGeometry, galaxyMaterial);

    scene.add(galaxy);
}

generateGalaxy();

gui.add(parameters, 'count').min(10000).max(1000000).step(100).onFinishChange(generateGalaxy);
gui.add(parameters, 'size').min(0.001).max(0.1).step(0.001).onFinishChange(generateGalaxy);

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
camera.position.x = 3
camera.position.y = 3
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