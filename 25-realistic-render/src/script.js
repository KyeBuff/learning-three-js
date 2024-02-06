/**
 * Notes
 * 
 * Tone mapping - process of converting high dynamic range (HDR) images to low dynamic range (LDR) images
 * THREEJS - Fakes tone mapping
 * 
 * Tone mapping is changed by updating the renderer
 * 
 * You can create your own tone mapping or import a custom one 
 * 
 * Reinhard - is the most realistic as it has the most realistic exposure, it has imperfections in the picture
 * 
 * Tone mapping exposure - is the amount of light that is allowed to enter the camera, e.g the strength of the tone mapping
 * 
 * Aliasing - is the jagged edges of the object, it is caused by the pixels of the screen
 * 
 * GPU determiens which pixels are rendered for a geometry
 * If you have a pixel grid, some pixels will be half and half required to make a curve/smooth edge
 * Because of this, a stair like effect is created 
 *    _ x
 *   |x x
 *  _ x x
 * |x x x
 * 
 * Techniques to solve this:
 * SSAA / FSAA - Super sampling anti aliasing / Full screen anti aliasing
 * Creates a render 4x larger than required and then downscales it to the required size
 * Bad for performance
 * 
 * MSAA - Multi sampling anti aliasing
 * Blends the colour of the edge pixels with the neighbouring pixel color
 * Will not fix aliasing in the middle of the geomeotry - only edges
 * 
 * Set antialiasing to true in the renderer, you do not need to if pixel ratio is above 1
 * So you can base the antialiasing on the pixel ratio
 * 
 * Shadows
 * 
 * Env map does not cast shadows it only adds light, background and reflections
 * We need to add lights to the scene and set shadows to true on render, camera and objects
 * 
 * updateWorldMatrix() on camera targets as THREE creates matrices for the camera before the render and actually before camera target is set
 * 
 * Textures
 * 
 * You only need to change the color space of visual textures, not normal maps, ao maps, roughness maps, metalness maps as they use the default colour space (linear).
 * 
 * SRBG - Standard RGB is for visual textures
 * 
 * Shadow acne on GLTF models
 * 
 * Shadow acne is caused by the model casting shadows on itself
 * 
 * It occurs when the edge of a model is between two parts of a pixel creating a stair like effect
 * You then see jagged edges on the model as it casts shadows on itself
 * 
 * bias can be changed to fix this on flat surfaces
 * normal bias can be changed to fix this on curved surfaces
 * 
 * Bias is set on the light source, it resizes the shadow map
 * 
 * Do this with GUI as it's very hard to get the right value
 * 
 */
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import GUI from 'lil-gui'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js'

/**
 * Loaders
 */
const gltfLoader = new GLTFLoader()
const rgbeLoader = new RGBELoader()

/**
 * Base
 */
// Debug
const gui = new GUI()
const global = {}

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Update all materials
 */
const updateAllMaterials = () =>
{
    scene.traverse((child) =>
    {
        if(child.isMesh && child.material.isMeshStandardMaterial)
        {
            child.material.envMapIntensity = global.envMapIntensity

            child.castShadow = true
            child.receiveShadow = true
        }
    })
}

/**
 * Environment map
 */
// Global intensity
global.envMapIntensity = 1
gui
    .add(global, 'envMapIntensity')
    .min(0)
    .max(10)
    .step(0.001)
    .onChange(updateAllMaterials)


// HDR (RGBE) equirectangular
rgbeLoader.load('/environmentMaps/0/2k.hdr', (environmentMap) =>
{
    environmentMap.mapping = THREE.EquirectangularReflectionMapping

    scene.background = environmentMap
    scene.environment = environmentMap
})

/**
 * Models
 */
// Helmet
gltfLoader.load(
    '/models/FlightHelmet/glTF/FlightHelmet.gltf',
    (gltf) =>
    {
        gltf.scene.scale.set(10, 10, 10)
        scene.add(gltf.scene)

        updateAllMaterials()
    }
)

const textureLoader = new THREE.TextureLoader();
const brickColorTexture = textureLoader.load('/textures/castle_brick_broken_06/castle_brick_broken_06_diff_1k.jpg');
const brickNormalTexture = textureLoader.load('/textures/castle_brick_broken_06/castle_brick_broken_06_nor_gl_1k.png');

// ARM
// AO - Ambient Occlusion
// Roughness
// Metalness
const brickARMTexture = textureLoader.load('/textures/castle_brick_broken_06/castle_brick_broken_06_arm_1k.jpg');
brickColorTexture.colorSpace = THREE.SRGBColorSpace;
brickNormalTexture.colorSpace = THREE.SRGBColorSpace;
brickARMTexture.colorSpace = THREE.SRGBColorSpace;

const woodColorTexture = textureLoader.load('/textures/wood_cabinet_worn_long/wood_cabinet_worn_long_diff_1k.jpg');

const woodNormalTexture = textureLoader.load('/textures/wood_cabinet_worn_long/wood_cabinet_worn_long_nor_gl_1k.png');
const woodARMTexture = textureLoader.load('/textures/wood_cabinet_worn_long/wood_cabinet_worn_long_arm_1k.jpg');

woodColorTexture.colorSpace = THREE.SRGBColorSpace;

const brickPlane = new THREE.Mesh(
    new THREE.PlaneGeometry(8, 8),
    new THREE.MeshStandardMaterial({ map: brickColorTexture, normalMap: brickNormalTexture, aoMap: brickARMTexture, roughnessMap: brickARMTexture, metalnessMap: brickARMTexture})
);
brickPlane.position.z = -4;
brickPlane.position.y = 4;
scene.add(brickPlane);

const woodPlane = new THREE.Mesh(
    new THREE.PlaneGeometry(8, 8),
    new THREE.MeshStandardMaterial({ map: woodColorTexture, normalMap: woodNormalTexture, aoMap: woodARMTexture, roughnessMap: woodARMTexture, metalnessMap: woodARMTexture})
);
// woodPlane.position.z = -4;
woodPlane.rotation.x = -Math.PI * 0.5;

scene.add(woodPlane);

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
camera.position.set(4, 5, 4)
scene.add(camera)

// Lights

const directionalLight = new THREE.DirectionalLight(0xffffff, 3)
directionalLight.position.set(-4, 6.5, 2.5);
gui.add(directionalLight, 'intensity').min(0).max(10).step(0.001).name('lightIntensity')
gui.add(directionalLight.position, 'x').min(-20).max(20).step(0.001).name('lightX')
gui.add(directionalLight.position, 'y').min(-20).max(20).step(0.001).name('lightY')
gui.add(directionalLight.position, 'z').min(-20).max(10).step(0.001).name('lightZ')

directionalLight.castShadow = true;
gui.add(directionalLight, 'castShadow')
scene.add(directionalLight)

directionalLight.shadow.camera.far = 15;
directionalLight.shadow.mapSize.set(1024, 1024);
directionalLight.target.position.set(0, 4, 0);
directionalLight.target.updateMatrixWorld();

// Controls
const controls = new OrbitControls(camera, canvas)
controls.target.y = 3.5
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.toneMapping = THREE.ReinhardToneMapping
renderer.toneMappingExposure = 3;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap

gui.add(renderer, 'toneMappingExposure').min(0).max(10).step(0.001);

gui.add(renderer, 'toneMapping', {
    No: THREE.NoToneMapping,
    Linear: THREE.LinearToneMapping,
    Reinhard: THREE.ReinhardToneMapping,
    Cineon: THREE.CineonToneMapping,
    ACESFilmic: THREE.ACESFilmicToneMapping
})

gui.add(directionalLight.shadow, 'normalBias').min(- 0.05).max(0.05).step(0.001)
gui.add(directionalLight.shadow, 'bias').min(- 0.05).max(0.05).step(0.001)

/**
 * Animate
 */
const tick = () =>
{
    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()