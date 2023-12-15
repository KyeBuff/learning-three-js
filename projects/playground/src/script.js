import './style.css'
import door from '../static/textures/door/color.jpg'
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

const canvas = document.querySelector('.webgl')

// We need three things:
// 1. scene
// 2. camera
// 3. renderer

const scene = new THREE.Scene();

const sphereGeom = new THREE.SphereGeometry(0.5, 16, 16);
// const sphereGeom = new THREE.BufferGeometry();

// const verteces = new Float32Array([
//   //x//y//z
//     0, 0, 0,
//     0, 1, 0,
//     1, 0, 0,
//     0, 0, 5,
//     5, 5, 0,
//     2, 2, 2
// ]);

// const vertecesAttribute = new THREE.BufferAttribute(verteces, 3);

// sphereGeom.setAttribute('position', vertecesAttribute);

const textureLoader = new THREE.TextureLoader();
const doorTexture = textureLoader.load(door);


const sphereMaterial = new THREE.MeshBasicMaterial({});
sphereMaterial.map = doorTexture

const sphere = new THREE.Mesh(sphereGeom, sphereMaterial);
scene.add(sphere);

const light = new THREE.PointLight( 'white' ); // soft white light
light.position.x = 2
light.position.y = 2;
light.position.z = 5;
scene.add( light );

// Camera aspect ratio should be based on the screen
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

// FOV, ratio, near, far
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 1, 1000);
camera.position.set(0, 0, 4);

scene.add(camera);

const renderer = new THREE.WebGLRenderer({
    canvas
});
renderer.setSize(sizes.width, sizes.height);

const clock = new THREE.Clock();

// const controls = new OrbitControls(camera, canvas);
// controls.enableDamping = true;
const cursor = {
    x: 0,
    y: 0
}

function tick() {
    /// renderer in here
    const elapsedTime = clock.getElapsedTime();

    // camera.position.x = cursor.x * 5;
    // camera.position.y = cursor.y * 5; 

    // Combining sin and cos can create a rotation

    // x value takes us to the left and right
    camera.position.x = Math.sin(cursor.x * Math.PI * 2) * 2
    
    // z value positive and negative gives us the depth we need to go around the object
    camera.position.z = Math.cos(cursor.x * Math.PI * 2) * 2

    // sin and cos work for this as we need the z to be deep or near when x is central and close when x is wide

    camera.position.y = cursor.y * 3;

    camera.lookAt(sphere.position);

    // Elapsed time multiplier accounts of variation in frame rate
    // sphere.rotation.y = 0.1 * elapsedTime
    // sphere.rotation.x = 0.15 * elapsedTime

    renderer.render(scene, camera);

    window.requestAnimationFrame(tick);
}

tick();

    // update sizes on resize
window.addEventListener('resize', () => {
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;

    camera.aspect = sizes.width / sizes.height;

    // must be called after change in params
    camera.updateProjectionMatrix();

    // Update renderer
    renderer.setSize(sizes.width, sizes.height);

    // Update pizel ratio
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
})

window.addEventListener('mousemove', (e) => {
    // if we divide the client value by the viewport height and width then we get a value between 0 and 1
    cursor.x = e.clientX / window.innerWidth -.5;
    cursor.y = - (e.clientY / window.innerHeight - .5);
})