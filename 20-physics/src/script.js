/***
 * Physics world separated from scene 

Updates applied to Physics and then to 3js objects

Csnnonjs kikks nice

In tick fn you have to tell world how to step update (1 / 60, deltaTime, subStrps to catch up, if the physics world is lagging behind 

Copy threejs metnod can take a whole object 

Materials and contact mateiral

Materiaks can be apllied to bodies

Contact material takes two materials and describes how they interact with each other

You can set a default contact material for the world to describe standard interaction

You have to add materials and contact material to the world

Applying forces

You can apply a force using two vec3s

Can be local force where target vec3 coords are the position on the geom not the world

We apply forces to bodies

Impulses can also be applied affecting velocity directly not as a result of force 

Create geometries and materials as little as possible

E.g. one sphere geom with a radius of 1 and then scaling it

You must update the quarternion value in the loop to copy from physics world - simulate resl life impact

Boxes in cannon use a half extend nit a h,w,d measurement (its the same but divided by 2) and must be a vec3

Performance 

Broadphase
Algorithm for collision detection
NAIVE - Test all objects eveb those miles away
Grid - test based on close items in a grid
Sweep and prune - random axis testing, most performant 

Grid and sweep only experiencing issues with super fast moving bodies

Update algo on the world 

Sleeping
Set sleeping to true and objects that are not moving (or super slow) will not be tested for collisions. You csn change thr speed limit and delay time limit on the world.

Events

Fire on collision etc

Get info abkut the collision 

Can pkay audio as a callback

Tasks:
- change volume basdd on strength of impact
- change sound based on object hititng what surface

Go further with Cannon
- Constraints (keep min distance, hinge movement constraint)
- Examples page has a car etc on it
- Workers for CPU / physics performance improvements - puts code on another thread


Cannon es - maintained oprn source cannon
PhysiJS - DRY as couples 3 and physics code
Ammo.js - more examples with 3, more popular
 */

import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import GUI from 'lil-gui'
import CANNON from 'cannon';

/**
 * Debug
 */
const gui = new GUI()

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Physics World
const world = new CANNON.World();

// Sweep and prune collision detection is performant and "best" as per course
world.broadphase = new CANNON.SAPBroadphase(world);
world.allowSleep = true

const plasticMaterial = new CANNON.Material('plastic')
const floorMaterial = new CANNON.Material('concrete')
const plasticFloorContactMaterial = new CANNON.ContactMaterial(plasticMaterial, floorMaterial, {
    friction: 0.1,
    restitution: 0.7
})

world.addContactMaterial(plasticFloorContactMaterial);

const floorShape = new CANNON.Plane();
const floorBody = new CANNON.Body({
    mass: 0, // mass 0 means object ignores gravity,
    shape: floorShape,
    material: floorMaterial
})

floorBody.quaternion.setFromAxisAngle(new CANNON.Vec3(-1, 0, 0), Math.PI * .5)

world.addBody(floorBody);

world.gravity.set(0, - 9.82, 0);

// Scene
const scene = new THREE.Scene()

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()
const cubeTextureLoader = new THREE.CubeTextureLoader()

const environmentMapTexture = cubeTextureLoader.load([
    '/textures/environmentMaps/0/px.png',
    '/textures/environmentMaps/0/nx.png',
    '/textures/environmentMaps/0/py.png',
    '/textures/environmentMaps/0/ny.png',
    '/textures/environmentMaps/0/pz.png',
    '/textures/environmentMaps/0/nz.png'
])

/**
 * Floor
 */
const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(10, 10),
    new THREE.MeshStandardMaterial({
        color: '#777777',
        metalness: 0.3,
        roughness: 0.4,
        envMap: environmentMapTexture,
        envMapIntensity: 0.5
    })
)
floor.receiveShadow = true
floor.rotation.x = - Math.PI * 0.5
scene.add(floor)

/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 2.1)
scene.add(ambientLight)

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6)
directionalLight.castShadow = true
directionalLight.shadow.mapSize.set(1024, 1024)
directionalLight.shadow.camera.far = 15
directionalLight.shadow.camera.left = - 7
directionalLight.shadow.camera.top = 7
directionalLight.shadow.camera.right = 7
directionalLight.shadow.camera.bottom = - 7
directionalLight.position.set(5, 5, 5)
scene.add(directionalLight)

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
camera.position.set(- 3, 3, 3)
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
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

let objects = [];

const sphereGeometry = new THREE.SphereGeometry(1, 20, 20);
const boxGeometry = new THREE.BoxGeometry(1, 1, 1);
const objectMaterial = new THREE.MeshStandardMaterial({
    metalness: 0.3,
    roughness: 0.4,
    envMap: environmentMapTexture,
    envMapIntensity: 0.5
});

const createBox = (vec3, position) => {
    const mesh = new THREE.Mesh(
        boxGeometry,
        objectMaterial
    );
    mesh.position.copy(position);
    mesh.scale.set(vec3.x, vec3.y, vec3.z);
    mesh.castShadow = true;

    scene.add(mesh);


    // Shape box uses half extents which is effectively a radius for each axis on a box and the value is half the full length
    // as calculation starts from center of box
    const shape = new CANNON.Box(new CANNON.Vec3(vec3.x / 2, vec3.y / 2, vec3.z / 2));
    const body = new CANNON.Body({
        mass: 1,
        material: plasticMaterial,
        position
    });

    body.addShape(shape);

    world.add(body);
    

    objects = [
        ...objects,
        {
            mesh,
            body
        }
    ]
}

const createSphere = (radius, position) => {
    const mesh = new THREE.Mesh(
        sphereGeometry,
        objectMaterial,
    )
    mesh.scale.set(radius, radius, radius);
    mesh.position.copy(position);
    mesh.castShadow = true

    const body = new CANNON.Body({
        mass: 1,
        position: position,
        shape: new CANNON.Sphere(radius),
        material: plasticMaterial
    });

    world.addBody(body)
    scene.add(mesh);

    objects = [...objects, {
        mesh,
        body
    }];
}

/**
 * Animate
 */
const clock = new THREE.Clock()
let lastElapsedTime = 0;

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()
    const deltaTime = elapsedTime - lastElapsedTime;

    lastElapsedTime = elapsedTime;

    objects.forEach(object => {
        object.mesh.position.copy(object.body.position);
        object.mesh.quaternion.copy(object.body.quaternion);
        
    })

    // https://gafferongames.com/post/fix_your_timestep/
    world.step(1 / 60, deltaTime, 3);

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

const debug = {
    generateSphere() {
        createSphere(Math.random() * .5, {x: Math.random() - .5, y: 3, z: Math.random() - .5})
    },
    generateBox() {
        createBox(
            {x: Math.random(), y: Math.random(), z: Math.random()}, 
            {x: (Math.random() - .5) * 3, y: 3, z: (Math.random() - .5) * 3}
        )
    }
}

gui.add(debug, 'generateSphere')
gui.add(debug, 'generateBox')

tick()

