/**
 * 
 * Notes
 * 
 * All lights can lookAt a Vector3 or mesh position
 * 
 * Ambient light - sends rays in all directions, even if a geom has a crevice or something - all will be lit
 * In real life, when you face an object it has light from behind what we can see due to light bouncing off surfaces but THREE does not support this due to performance reasons. A dim ambient light from behind can be used to create this effect
 * 
 * Directional light - sends rays from a point to the centre of the scene. Distance doesn't matter (unless using shaders)
 * 
 * The sun is an example of this
 * 
 * Hemisphere light - 2 colours, 1 for sky colour, second for the ground colour
 * Ambient
 * 
 * Think blue sky, green grass
 * 
 * Point Light - like a sparking a ligther
 * Small point sending light in all directions
 * 
 * Can also set it's max distance to light other objects and decay for how quickly it dims
 * 
 * Rect area light - like a big plane, with light heading in all directions
 * 
 * Like a big light on a photoshoot
 * 
 * Only works with normal or physical material
 * 
 * 
 * Spot light - torch-like
 * 
 * Penumbra value represents the control of dimming on the edges of the light
 * 
 * You cannot rotate this light, you instead update it's target position and add it to the scene
 * 
 * spotlight.target.position.x = <adsd>
 * scene.add(spotlight.target
 * 
 * Performance:
 * 
 * Fast - Ambient and hemi 
 * Moderate - spotlight and DirectionalLight
 * Slow - pointlight and rect area
 * 
 * 
 * Baking is the process of adding light and shadows to textures to avoid slow light performance
 * 
 * Helper classes look useful for seeing the light psoition and direction
 */

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
 * Lights
 */

const light = new THREE.RectAreaLight(0xffff33);
scene.add(light);

/**
 * Objects
 */
// Material
const material = new THREE.MeshStandardMaterial()
material.roughness = 0.4

// Objects
const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 32, 32),
    material
)
sphere.position.x = - 1.5

const cube = new THREE.Mesh(
    new THREE.BoxGeometry(0.75, 0.75, 0.75),
    material
)

const torus = new THREE.Mesh(
    new THREE.TorusGeometry(0.3, 0.2, 32, 64),
    material
)
torus.position.x = 1.5

const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(5, 5),
    material
)
plane.rotation.x = - Math.PI * 0.5
plane.position.y = - 0.65

scene.add(sphere, cube, torus, plane)

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
camera.position.x = 1
camera.position.y = 1
camera.position.z = 2
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

    // Update objects
    sphere.rotation.y = 0.1 * elapsedTime
    cube.rotation.y = 0.1 * elapsedTime
    torus.rotation.y = 0.1 * elapsedTime

    sphere.rotation.x = 0.15 * elapsedTime
    cube.rotation.x = 0.15 * elapsedTime
    torus.rotation.x = 0.15 * elapsedTime

    light.rotation.y = Math.PI * elapsedTime;
    light.rotation.x = Math.PI * elapsedTime;

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()