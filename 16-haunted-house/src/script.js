/***
 * Textures will either stretch or repeat if you ask them too
 * 
* displacement is the textures depth map with a displacement scale
* ambient occlusion - add fake shadows in crevices
* normals - how a textures parts respond to light, adds detail - no subdivision required 
* alpha - black is visible, white is not
* roughness - rough or smooth
* metalness - shiny or matt
* map - color / albedo
 */

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

const brickTextures = {
    // ambient occlusion allows for shadows in things like crevices in a texture as defined by the map
    aoMap: textureLoader.load('/textures/bricks/ambientOcclusion.jpg'),
    map: textureLoader.load('/textures/bricks/color.jpg'),
    // normal map can add detail without subdivision, works mostly around lightr
    normalMap: textureLoader.load('/textures/bricks/normal.jpg'),
    // How rough or smooth
    roughnessMap: textureLoader.load('/textures/bricks/roughness.jpg'),
}

const doorTextures = {
    // ambient occlusion allows for shadows in things like crevices in a texture as defined by the map
    alphaMap: textureLoader.load('/textures/door/alpha.jpg'),
    aoMap: textureLoader.load('/textures/door/ambientOcclusion.jpg'),
    map: textureLoader.load('/textures/door/color.jpg'),
    // Increase subdivision to allow for "height" or "depth" effect on texture
    // dispalcement scale used to increase depth
    displacementMap: textureLoader.load('/textures/door/height.jpg'),
    normalMap: textureLoader.load('/textures/door/normal.jpg'),
    metalnessMap: textureLoader.load('/textures/door/metalness.jpg'),
    roughnessMap: textureLoader.load('/textures/door/roughness.jpg'),
}

const grassTextures = {
    aoMap: textureLoader.load('/textures/grass/ambientOcclusion.jpg'),
    map: textureLoader.load('/textures/grass/color.jpg'),
    normalMap: textureLoader.load('/textures/grass/normal.jpg'),
    roughnessMap: textureLoader.load('/textures/grass/roughness.jpg'),
}

brickTextures.map.colorSpace = THREE.SRGBColorSpace;
doorTextures.map.colorSpace = THREE.SRGBColorSpace;

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
        ...brickTextures
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
    new THREE.PlaneGeometry(2.2, 2.2, 100, 100),
    new THREE.MeshStandardMaterial({
        ...doorTextures,
        displacementScale: 0.1,
        transparent: true
    })
)

door.position.y = 1;
door.position.z = 2 + 0.01;

const bushGeom = new THREE.SphereGeometry(.5)
const bushMaterial =   new THREE.MeshStandardMaterial({
    color: '#068906'
})

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

    b.castShadow = true;

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

    grave.castShadow = true;

    graves.add(grave);
}

house.add(door, walls, roof, graves);

Object.values(grassTextures).forEach(texture => {
    texture.repeat.set(8, 8);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping
})

// Floor
const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(20, 20),
    new THREE.MeshStandardMaterial({ 
        ...grassTextures,
     })
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

const doorLight = new THREE.PointLight('#ff7d46', 3, 7); 
doorLight.position.set(0, 2.2, 2.7)
house.add(doorLight)

moonLight.shadow.camera.far = 14;
doorLight.shadow.camera.far = 5
moonLight.shadow.mapSize.width = 256;
moonLight.shadow.mapSize.height = 256;
doorLight.shadow.mapSize.width = 256;
doorLight.shadow.mapSize.height = 256;


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

// Shadows
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
floor.receiveShadow = true;
walls.castShadow = true;
doorLight.castShadow = true;
moonLight.castShadow = true;

// Ghosts

const ghosts = [
    {
        color: 'blue',
        intensity: 2,
        distance: 3,
        light: null,
        animate(elapsedTime) {
            const angle = - elapsedTime * .5;
            const radius = 3 + Math.random() * 3    ;

            this.light.position.x = Math.sin(angle) * radius;
            this.light.position.z = Math.cos(angle) * radius;

            // Multiplication in the sin function causes a slower jump
            this.light.position.y = Math.sin(elapsedTime * 1.5) * 2
        }
    },
    {
        color: 'red',
        intensity: 2,
        distance: 3,
        light: null,
        animate(elapsedTime) {
            const angle = elapsedTime;
            const radius = 4 + Math.random() * 10;

            this.light.position.x = Math.sin(angle) * radius;
            this.light.position.z = Math.cos(angle) * radius;

            // Multiplication in the sin function causes a slower jump
            this.light.position.y = Math.sin(elapsedTime * 3)
        }
    },
    {
        color: 'green',
        intensity: 2,
        distance: 3,
        light: null,
        animate(elapsedTime) {
            const angle = -(Math.random() - .5) + elapsedTime ;
            const radius = 7;

            this.light.position.x = Math.sin(angle) * radius;
            this.light.position.z = Math.cos(angle) * radius;

            // Multiplication in the sin function causes a slower jump
            this.light.position.y = Math.sin(elapsedTime * 3)
        }
    },
].map(ghost => {
    ghost.light = new THREE.PointLight(ghost.color, ghost.intensity, ghost.distance);
    ghost.light.shadow.mapSize.height = 256;
    ghost.light.shadow.mapSize.width = 256;
    scene.add(ghost.light);

    return ghost;
})


/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    ghosts.forEach(ghost => {
        ghost.animate(elapsedTime);
    })

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()