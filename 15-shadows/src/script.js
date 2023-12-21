/****
 * 
 * 3js creates a shadow map during the render phase 

    Before final render, it position's the camera as if it was each light and uses a MeshDepthMaterial on each object to understand depth, colouring of light on the object and to gen its shadows

    The renderer requires shadows to be enabled

    Them the objects - receive and/or cast

    Then the lighrs - cast


    Performance 

    The shadow map size can be changed to improve or reduce shadow render quality 
    It is a mipmap so sizing is to yhe power of2
    We do this on the light itself as that is the thing that generates the mipmap shadow map during the light camera render


    Shadow map Camera optimisations

    YOu can add a CameraHelper to the shadow camera to change it's near and far values to be more efficent for the scene

    You can also resize the camera to improve shadow render and reduce camera amplitude

    Radius properties can be used to fade blur into the shadow

    Shadow algo can be chagned to improve render or performance
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
// Ambient light
const ambientLight = new THREE.AmbientLight(0xffffff, 1)
gui.add(ambientLight, 'intensity').min(0).max(3).step(0.001)
scene.add(ambientLight)

// Directional light
const directionalLight = new THREE.DirectionalLight(0xffffff, 1.5)
directionalLight.position.set(2, 2, - 1)
gui.add(directionalLight, 'intensity').min(0).max(3).step(0.001)
gui.add(directionalLight.position, 'x').min(- 5).max(5).step(0.001)
gui.add(directionalLight.position, 'y').min(- 5).max(5).step(0.001)
gui.add(directionalLight.position, 'z').min(- 5).max(5).step(0.001)
directionalLight.castShadow = true;

directionalLight.shadow.camera.near = 1
directionalLight.shadow.camera.far = 6
directionalLight.shadow.camera.top = 2
directionalLight.shadow.camera.bottom = -2
directionalLight.shadow.camera.left = -2
directionalLight.shadow.camera.right = 2

const shadowCameraHelper = new THREE.CameraHelper(directionalLight.shadow.camera)
shadowCameraHelper.visible = false;
scene.add(shadowCameraHelper, directionalLight)

/**
 * Materials
 */
const material = new THREE.MeshStandardMaterial()
material.roughness = 0.7
gui.add(material, 'metalness').min(0).max(1).step(0.001)
gui.add(material, 'roughness').min(0).max(1).step(0.001)

/**
 * Objects
 */
const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 32, 32),
    material
)
sphere.castShadow = true;
const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(5, 5),
    material
)
plane.receiveShadow = true;
plane.rotation.x = - Math.PI * 0.5
plane.position.y = - 0.5

const textureLoader = new THREE.TextureLoader();
const shadowAlphaMap = textureLoader.load('/textures/simpleShadow.jpg')
const shadowPlaneMaterial = new THREE.MeshBasicMaterial({
    color: 0x0000000,
    alphaMap: shadowAlphaMap,
    transparent: true
})
const shadowPlane = new THREE.Mesh(
    new THREE.PlaneGeometry(1.25, 1.25),
    shadowPlaneMaterial
)
shadowPlane.rotateX(- (Math.PI * .5))
shadowPlane.position.y = plane.position.y + 0.01

scene.add(sphere, plane, shadowPlane)

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

renderer.shadowMap.enabled = false;
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    sphere.position.x = Math.sin(elapsedTime) * 1.5;
    sphere.position.z = Math.cos(elapsedTime) * 1.5;
    sphere.position.y = Math.abs(Math.sin(elapsedTime * 4))

    shadowPlane.position.x = sphere.position.x
    shadowPlane.position.z = sphere.position.z

    shadowPlane.material.opacity = (1 - sphere.position.y) * .3

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()