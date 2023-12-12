import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import doorColor from '../static/textures/checkerboard-1024x1024.png'

const loadingManager = new THREE.LoadingManager()
const textureLoader = new THREE.TextureLoader(loadingManager);
const colorTexture = textureLoader.load(doorColor);

colorTexture.repeat.x = 2;
colorTexture.repeat.y = 3;

colorTexture.wrapS = THREE.RepeatWrapping;
colorTexture.wrapT = THREE.RepeatWrapping;

// loadingManager.onStart = () => {
//     console.log('Start')
// }
// loadingManager.onLoad = () => {
//     console.log('Load')
// }
// loadingManager.onProgress = () => {
//     console.log('Progress')
// }

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Object
 */

// Geometry is our shape, we are using the BoxGeometry class which inherits from the BufferGeometry class
const geometry = new THREE.BoxGeometry(1, 1, 1)

// Materials apllied to a mesh along with a geometry, this provides colour/texture
const material = new THREE.MeshBasicMaterial({ map: colorTexture })

// Mesh combines geometry and material to provide a skin to our geometry
const mesh = new THREE.Mesh(geometry, material)
scene.add(mesh)

/**
 * Sizes
 */
// Track the sizze of the viewport and update as the window is resized
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
    // Update aspect ratio
    camera.aspect = sizes.width / sizes.height
    // We must call this function when the any of the camera properties change
    // As the screen size and aspect ratio changes, we update the camera
    camera.updateProjectionMatrix()

    // Update renderer
    // Update the size of the canvas, and the size of the canvas will be updated to match the size of the window in this instance
    renderer.setSize(sizes.width, sizes.height)
    // Update the pixel ration of the renderer
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera

// Inherits from Three JS camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 1
camera.position.y = 1
camera.position.z = 1

// Add camera to the scene
scene.add(camera)

// Controls

// As with the name, OrbitControls allow the camera to orbit around an object
const controls = new OrbitControls(camera, canvas)
// Damping provides a release effect, as in when you move the object it will slow down as rather than abrupt stoppage
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)

// Pixel rations and therefore the render changes depending on the device
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()

// Our game loop
// We use requestAnimationFrame to run the game loop
// 60fps

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