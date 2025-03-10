import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

/**
 * Base
 */
// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

const textureLoader = new THREE.TextureLoader();
const doorColorTexture = textureLoader.load("./textures/door/color.jpg");
const doorAlphaTexture = textureLoader.load("./textures/door/alpha.jpg");
const doorAmbientOcclusionTexture = textureLoader.load(
  "./textures/door/ambientOcclusion.jpg"
);
const doorHeightTexture = textureLoader.load("./textures/door/height.jpg");
const doorNormalTexture = textureLoader.load("./textures/door/normal.jpg");
const doorMetalnessTexture = textureLoader.load("./textures/door/metalness.jpg");
const doorRoughnessTexture = textureLoader.load("./textures/door/roughness.jpg");
const environmentMapTexture = textureLoader.load("./textures/environmentMap/2k.hdr");
const gradientThreeTexture = textureLoader.load("./textures/gradients/3.jpg");
const gradientFiveTexture = textureLoader.load("./textures/gradients/5.jpg");
const matcapOneTexture = textureLoader.load("./textures/matcaps/1.png");
const matcapTwoTexture = textureLoader.load("./textures/matcaps/2.png");
const matcapThreeTexture = textureLoader.load("./textures/matcaps/3.png");
const matcapFourTexture = textureLoader.load("./textures/matcaps/4.png");
const matcapFiveTexture = textureLoader.load("./textures/matcaps/5.png");
const matcapSixTexture = textureLoader.load("./textures/matcaps/6.png");
const matcapSevenTexture = textureLoader.load("./textures/matcaps/7.png");
const matcapEightTexture = textureLoader.load("./textures/matcaps/8.png");

doorColorTexture.colorSpace = THREE.SRGBColorSpace;

const material = new THREE.MeshBasicMaterial({
    map: doorColorTexture,
});

const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.5, 16, 16), material);
sphere.position.x = -1.5;

const torus = new THREE.Mesh(
  new THREE.TorusGeometry(0.3, 0.2, 16, 32),
  material
);
torus.position.x = 1.5;

const plane = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), material);

scene.add(sphere, torus, plane);

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.x = 1;
camera.position.y = 1;
camera.position.z = 2;
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();
  sphere.rotation.x = -0.1 * elapsedTime;
  torus.rotation.y = -0.1 * elapsedTime;
  plane.rotation.y = 0.1 * elapsedTime;
  plane.rotation.x = -0.1 * elapsedTime;
  torus.rotation.x = -0.1 * elapsedTime;
  sphere.rotation.y = 0.1 * elapsedTime;

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
