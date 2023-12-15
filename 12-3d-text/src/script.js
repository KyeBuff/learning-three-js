/***
 * Resources
 * Convert font to TYPEFACE JSON - http://gero3.github.io/facetype.js/
 */

/**
 * 
 * Notes
 * 
 * Frustrum culling - mathematical calculation to detect whether to render an object, e.g if it's behind the camera then do not
 * 
 * Bounding - each object has a bounding, which can be a sphere or a rectangle that is the bounding box of that object. 
 * Used in frustrum culling but can be used for centering an unusual geometry
 * 
  * THREE JS uses sphere bounding by default (for text?) but we can change this (see below)
  * 
  * 
* When moving the text, we move the geometry and not the mesh to the left so that this creates a central point for any rotation et
 */


import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js'
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
 * Textures
 */
const textureLoader = new THREE.TextureLoader()

const fontLoader = new FontLoader();
fontLoader.load('/fonts/helvetiker_regular.typeface.json', (font) => {

    // Create geom
    const geometry = new TextGeometry('Merry Christmas', {
        font,
        size: .5,
        height: 0.2,
        bevelEnabled: true,
        bevelThickness: 0.03,
        bevelSize: 0.02,
        bevelOffset: 0,
        bevelSegments: 5
    });

    // geometry.computeBoundingBox();
    // const box = geometry.boundingBox.max;

    // geometry.translate(
    //     - box.x * 0.5,
    //     - box.y * 0.5,
    //     - box.z * 0.5
    // )

    geometry.center();

    const textureLoader = new THREE.TextureLoader();
    const matcapTexture = textureLoader.load(
        '/textures/matcaps/6.png'
    )

    matcapTexture.colorSpace = THREE.SRGBColorSpace

    
    // Create material
    const material = new THREE.MeshMatcapMaterial({
        matcap: matcapTexture
    });
    
    // Create the mesh
    
    const text = new THREE.Mesh(geometry, material);
    text.position.y = 1;

    // Add to scene
    scene.add(text);


});

/**
 * Object
 */
const cube = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshBasicMaterial()
)

// scene.add(cube)

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

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()