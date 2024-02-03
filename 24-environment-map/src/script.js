/**
 * Notes
 * 
 * Polyhaven provides env maps - good licence for whatever you want to use
 * https://polyhaven.com/
 * https://polyhaven.com/hdris
 * 
 * AI can generate them for you too
 * 
 * HDR to CubeMap
 * https://matheowis.github.io/HDRI-to-CubeMap/
 * 
 * Env maps can be made into cubes and loaded into a cube texture loader
 * 
 * Object3D.traverse() - allows you to traverse through all the children of an object
 * For the scene this would be all the objects in the scene
 * 
 * Each object3d and it's material contains a bool property called is<TYPE>
 * 
 * BG env map blurriness
 * If is low res, you can blur it to make it look better if that's your desired effect
 * 
 * Background intensity - does not affect env map, lighting etc but does affect the background itself
 * 
 * HDR - High Dynamic Range
 * Equirectangular format - 1 file with all the "sides of the cube", 360 of the whole scene
 * Need to define this format as a mapping on the envMap import
 * HDR does not have to be in equirectangular format but often is
 * Pixel colors can be more precise and have a wider range - to account for luminosity
 * Luminsoity - the amount of light emitted by a source 
 * File size is larger
 * 
 * Lighting
 * - You can use a low res HDR with more blurriness to replicate it's lighting
 * - This means we do not use it as a background (as that would look bad) but for lighting the file size will be small and the effect good
 * 
 * We use a RGBE loader to load HDR files - RGBE where E is for exponent to store brightness. RGBE is the encoding of the HDR file
 * 
 * Blender notes
 * Sampling - can reduce to 256 to have sensible performance. Sampling is the number of rays that are cast to calculate the lighting/color
 * Resolution needs to be 2:1 - so we have used 2048x1024   
 * We have used the Cycles renderer
 * We changed the world color to black
 * 
 * We use a camera with a panoramic view to capture the whole scene
 * We also set it to the equirectangular format
 * We enabled camera to true in object properties so that the camera can see it
 * We add objects to each axis +/- like we are in the center of the cube
 * We create a light pointing to the centre of the scene / meta-cube with high intensity like the sun
 * We render the image as a radiance HDR file to capture the lighting 
 * We set our camera to face on the X axis, treating the Z like the sky and floor
 * 
 * OPT+S to save the image as a HDR file
 * 
 * You can disable the background of the scene if you just want to capture the lighting
 * Therefore you can create a really basic set of lights in blender where the render looks naff but you get good lighting and use the HDR to light the scene
 * 
 * EXR is HDR but encoded in a different way
 * EXR also supports layers whereas HDR does not
 * EXR encoding supports the alpha channel and has a different range of colors
 * 
 * JPG LDR env maps - low dynamic range
 * Imported as a texture, then the mapping is set to EquirectangularReflectionMapping
 * SRGBEncoding should be set on the texture as it is JPG
 * 
 * 
 * Ground projected skybox
 * With objects that are at the center of the scene on the Z axis, the skybox will be projected onto the ground and make objects appear that they are on the ground
 * This won't look great if objects are at the center of the environment map as they will be skewed
 *
 */

import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import GUI from 'lil-gui'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { RGBELoader } from 'three/addons/loaders/RGBELoader.js'
import { EXRLoader } from 'three/addons/loaders/EXRLoader.js'
import { GroundProjectedSkybox } from 'three/addons/objects/GroundProjectedSkybox.js'

// Scene
const scene = new THREE.Scene()


// Debug
const gui = new GUI()

const updateAllMaterials = () => {
    scene.traverse((child) => {
        if (child.isMesh && child.material.isMeshStandardMaterial) {
            child.material.envMapIntensity = debug.envMapIntensity;
        }
    });

}

const debug = {
    envMapIntensity: 1,
}

scene.backgroundBlurriness = 0
scene.backgroundIntensity = 1

gui.add(debug, 'envMapIntensity').min(0).max(10).step(0.001).onFinishChange(updateAllMaterials)
gui.add(scene, 'backgroundBlurriness').min(0).max(1).step(0.001).onFinishChange();
gui.add(scene, 'backgroundIntensity').min(0).max(10).step(0.001).onFinishChange();


const gltfLoader = new GLTFLoader();
const textureLoader = new THREE.TextureLoader()

// const cubeTextureLoader = new THREE.CubeTextureLoader()

gltfLoader.load('/models/FlightHelmet/glTF/FlightHelmet.gltf', (gltf) => {
    gltf.scene.scale.set(10, 10, 10)
    scene.add(gltf.scene)

    updateAllMaterials();
})

/**
 * Base
 */

// Canvas
const canvas = document.querySelector('canvas.webgl')


/**
 * Env maps
 */

// LDR Cube Texture
// Note: Takes 6 images and maps them to the inside of a cube

// The file names refer to X/Y/Z axis:
// py - positive Y
// ny - negative Y
// px - positive X
// nx - negative X
// same for z

const envMapFolder = 2;
// const envMap = cubeTextureLoader.load([
//     `/environmentMaps/${envMapFolder}/px.png`,
//     `/environmentMaps/${envMapFolder}/nx.png`,
//     `/environmentMaps/${envMapFolder}/py.png`,
//     `/environmentMaps/${envMapFolder}/ny.png`,
//     `/environmentMaps/${envMapFolder}/pz.png`,
//     `/environmentMaps/${envMapFolder}/nz.png`,
// ], () => {
//     console.log('loaded');
// });

// // Note: sets the background of the scene but doesn't affect lighting
// scene.background = envMap
// // Note: sets the lighting of the scene
// scene.environment = envMap

const rgbeLoader = new RGBELoader();
const exrLoader = new EXRLoader();

// 2k refers to resolution
rgbeLoader.load(`/environmentMaps/${envMapFolder}/2k.hdr`, (envMap) => {
    envMap.mapping = THREE.EquirectangularReflectionMapping;

    scene.environment = envMap;

    const skybox = new GroundProjectedSkybox(envMap);

    skybox.radius = 120;
    skybox.height = 11
    skybox.scale.setScalar(50);

    scene.add(skybox);
});
// rgbeLoader.load(`/environmentMaps/blender-2k.hdr`, (envMap) => {
//     envMap.mapping = THREE.EquirectangularReflectionMapping;

//     scene.environment = envMap;
//     // scene.background = envMap;
// });

// exrLoader.load(`/environmentMaps/nvidiaCanvas-4k.exr`, (envMap) => {
//     envMap.mapping = THREE.EquirectangularReflectionMapping;

//     scene.environment = envMap;
//     scene.background = envMap;
// });
// const envMap = textureLoader.load(`/environmentMaps/blockadesLabsSkybox/scifi_white_sky_scrapers_in_clouds_at_day_time.jpg`);
// envMap.mapping = THREE.EquirectangularReflectionMapping;
// envMap.colorSpace = THREE.SRGBColorSpace;

// scene.environment = envMap;
// scene.background = envMap;


/**
 * Torus Knot
 */
const torusKnot = new THREE.Mesh(
    new THREE.TorusKnotGeometry(1, 0.4, 100, 16),
    new THREE.MeshStandardMaterial({
        roughness: .3,
        metalness: 1,
        color: 0xaaaaaa
    })
)
torusKnot.position.y = 4
torusKnot.position.x = -4
scene.add(torusKnot)

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

// Controls
const controls = new OrbitControls(camera, canvas)
controls.target.y = 3.5
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
    // Time
    const elapsedTime = clock.getElapsedTime()

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()