import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import GUI from 'lil-gui'

/**
 * Units:
 * - metres
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

const fog = new THREE.Fog('#262837', 1, 15)
scene.fog = fog

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()

/**
 * House
 */

const house = new THREE.Group();
scene.add(house);

// walls
// box geom

const wallSize = {
    height: 2.5,
    width: 4,
    depth: 4
}
const walls = new THREE.Mesh(
    new THREE.BoxGeometry(wallSize.width, wallSize.height, wallSize.depth),
    new THREE.MeshStandardMaterial({
        color: '#c4c4c4'
    })
)

walls.position.y = wallSize.height / 2

const roof = new THREE.Mesh(
    new THREE.ConeGeometry(3.5, 1, 4),
    new THREE.MeshStandardMaterial({
        color: '#5d0e0e'
    })
)
roof.position.y = wallSize.height + 0.5
roof.rotation.y = Math.PI * 0.25

const door = new THREE.Mesh(
    new THREE.PlaneGeometry(1, 2),
    new THREE.MeshBasicMaterial({
        color: '#3d2815'
    })
)

door.position.y = 1;
door.position.z = 2 + 0.01;

const bushGeom = new THREE.SphereGeometry(.5)
const bushMaterial =   new THREE.MeshStandardMaterial({
    color: '#068906'
})

gui.addColor(bushMaterial, 'color');

const bushes = [
    {
        position: {
            x: 1.1,
            y: 0.3,
            z: 2.001
        },
        scale: 1
    },
    {
        position: {
            x: 1.6,
            y: 0.1,
            z: 2.001
        },
        scale: .5
    },
    {
        position: {
            x: -1.1,
            y: 0.3,
            z: 2.001
        },
        scale: 1
    },
    {
        position: {
            x: -.9,
            y: 0.1,
            z: 2.3
        },
        scale: .5
    }
]

bushes.forEach(({position, scale}) => {
    const b = new THREE.Mesh(bushGeom, bushMaterial);

    b.position.set(position.x, position.y, position.z);
    b.scale.set(scale, scale, scale) 

    house.add(b);
})

const graves = new THREE.Group();
graves.position.y = .5;
const graveGeometry = new THREE.BoxGeometry(1, 1, .125);
const graveMaterial = new THREE.MeshStandardMaterial({
    color: 'grey'
})

for(let i = 0; i < 50; i++) {
    // below code gets a random angle as a float 0 - 6.blah
    const angle = Math.random() * Math.PI * 2;
    // set the minimum and max radius
    const radius = 3.5 + Math.random() * 6 

    const grave = new THREE.Mesh(
        graveGeometry,
        graveMaterial
    )


    grave.position.x = Math.sin(angle) * radius
    grave.position.z = Math.cos(angle) * radius
    grave.position.y = -0.05

    grave.rotation.y = (Math.random() - .5) * .4
    grave.rotation.z = (Math.random() - .5) * .4

    graves.add(grave);
}

house.add(door, walls, roof, graves);


// Floor
const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(20, 20),
    new THREE.MeshStandardMaterial({ color: '#a9c388' })
)
floor.rotation.x = - Math.PI * 0.5
floor.position.y = 0
scene.add(floor)

/**
 * Lights
 */
// Ambient light
const ambientLight = new THREE.AmbientLight('#b9d5ff', 0.2)
gui.add(ambientLight, 'intensity').min(0).max(1).step(0.001)
scene.add(ambientLight)

// Directional light
const moonLight = new THREE.DirectionalLight('#b9d5ff', 0.3)
moonLight.position.set(4, 5, - 2)
gui.add(moonLight, 'intensity').min(0).max(1).step(0.001)
gui.add(moonLight.position, 'x').min(- 5).max(5).step(0.001)
gui.add(moonLight.position, 'y').min(- 5).max(5).step(0.001)
gui.add(moonLight.position, 'z').min(- 5).max(5).step(0.001)
scene.add(moonLight)

const doorLight = new THREE.PointLight('orange', 3, 7); 
doorLight.position.set(0, 2.2, 2.7)
house.add(doorLight)

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
camera.position.x = 4
camera.position.y = 2
camera.position.z = 5
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
renderer.setClearColor('#262837')
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