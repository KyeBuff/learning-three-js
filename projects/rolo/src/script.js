
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import GUI from 'lil-gui'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js'


/**
 * Base
 */
// Debug
const gui = new GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()
scene.background = ''
/**
 * Lights
 */

const directionalLight = new THREE.HemisphereLight(0xfff, 0xfff, 10)
scene.add(directionalLight)


/**
 * Objects
 */
// Material

const textureLoader = new THREE.TextureLoader();
const metal = textureLoader.load('/metal.png');
metal.colorSpace = THREE.SRGBColorSpace

const cylinder = new THREE.CylinderGeometry(1.75, 2.25, 2.4, 40, 8, true)
const material = new THREE.MeshMatcapMaterial({
    matcap: metal
});
const roloSide = new THREE.Mesh(cylinder, material);
const circleBottom = new THREE.CircleGeometry(2.25)
const circleTop = new THREE.CircleGeometry(1.75 - .10)

const roloBottom = new THREE.Mesh(circleBottom, material);
roloBottom.rotation.x = Math.PI * .5;
roloBottom.position.y = -1.2

const roloTop = new THREE.Mesh(circleTop, material);
roloTop.rotation.x = - (Math.PI * .5);
roloTop.position.y = 1

const rolo = new THREE.Group();
rolo.add( roloSide );
rolo.add( roloBottom )
rolo.add( roloTop )

const loader = new FontLoader();

loader.load( '/Dancing_Script_Regular.json', function ( font ) {

	const geometry = new TextGeometry( "It's the journey xxx", {
		font: font,
		size: .4,
		height: 0.1,
		curveSegments: 12,
	} );

    geometry.center();

    const material = new THREE.MeshStandardMaterial({
        color: 'black',
        metalness: .2
    })

    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.y = -1.15
    mesh.rotation.x = Math.PI  / 2
    rolo.add(mesh);

    scene.add(rolo);

} );



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
camera.position.y = 2
camera.position.z = -8
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

    rolo.rotation.x = Math.PI * elapsedTime / 8
    rolo.rotation.y = Math.PI * elapsedTime / 4

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()