import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import GUI from 'lil-gui'

/***
 * 
 * Modulo - a nice way to think of it is, is if you want to ensure the number reaches the number you are dividing by (using modulo on)
 * E.g. x % 3 - you will never get to 3, only 0 1 2, 0 1 2, 0 1 2
 * 
 * Great for branching off
 * 
 * (index % parameters.branches) / parameters.branches - returns the fraction (as a decimal) between 0 and 1. E.g for 3 branches, this will give:
 * 0 0.33 0.66 
 * 
 * Which can be applied against Math.PI * 2 to create 3 equal radians of that circle
 * 
 *      const radius = Math.random() * parameters.radius;
        const angle = (index % parameters.branches) / parameters.branches * Math.PI * 2;

    In a 3 branch example, cos and sin used on the x and z axis below, ensure that the angle is applied to a circle and that the x and z focus around a circle point

    Sin and cos always based their output on a circle with a radius of 1

    Multiplied by a random radius gives us a star branching effect
        positions[i3] = Math.cos(angle);
        positions[i3 + 1] = 0;
        positions[i3 + 2] = Math.sin(angle);


    Adding the spin effect is easier than it looks.

    We want the curve to be stronger when it gets to the end of the branch
    Therefore we can just use the radius random value (distance from centre) as a multplier to the spin param
 * 
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
 * Galaxy
 */


const parameters = {
    count: 100000,
    size: 0.01,
    radius: 5,
    branches: 3,
    curve: 1
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

        const radius = Math.random() * parameters.radius;

        const curveAngle = radius * parameters.curve;
        const branchAngle = (index % parameters.branches) / parameters.branches * Math.PI * 2;

        positions[i3] =  Math.cos(branchAngle + curveAngle) * radius;
        positions[i3 + 1] = 0;
        positions[i3 + 2] =  Math.sin(branchAngle + curveAngle) * radius;
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

gui.add(parameters, 'count').min(100).max(1000000).step(100).onFinishChange(generateGalaxy);
gui.add(parameters, 'size').min(0.001).max(0.1).step(0.001).onFinishChange(generateGalaxy);
gui.add(parameters, 'radius').min(0.01).max(10).step(0.1).onFinishChange(generateGalaxy);
gui.add(parameters, 'branches').min(2).max(10).step(1).onFinishChange(generateGalaxy);
gui.add(parameters, 'curve').min(-5).max(5).step(0.01).onFinishChange(generateGalaxy);

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