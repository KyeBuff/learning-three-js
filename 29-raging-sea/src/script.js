import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import GUI from 'lil-gui'

// import vertex shader
import vertexShader from './shader/water/vertex.glsl'
// import fragment shader
import fragmentShader from './shader/water/fragment.glsl'

/**
 * Base
 */
// Debug
const gui = new GUI({ width: 340 })

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Water
 */
// Geometry
const waterGeometry = new THREE.PlaneGeometry(2, 2, 128, 128)


const colorsDebug = {
    uDepthColor: '#186691',
    uSurfaceColor: '#9bd8ff'
}

// Material
const waterMaterial = new THREE.ShaderMaterial({
    side: THREE.DoubleSide,
    vertexShader: vertexShader,
    fragmentShader: fragmentShader,
    uniforms: {
        uTime: { value: 0 },
        uWaveElevation: {
            value: 0.1
        },
        uWaveFrequency: {
            value: new THREE.Vector2(4.5, 1.5)
        },
        uWaveSpeed: {
            value: 0.75
        },
        uDepthColor: {
            value: new THREE.Color(colorsDebug.uDepthColor)
        },
        uSurfaceColor: {
            value: new THREE.Color(colorsDebug.uSurfaceColor)
        },
        uColorOffset: {
            value: 0.08 
        },
        uColorMultiplier: {
            value: 5
        }
    }
})

gui.add(waterMaterial.uniforms.uWaveElevation, 'value').min(0).max(1).step(0.001).name('uWaveElevation')
gui.add(waterMaterial.uniforms.uWaveFrequency.value, 'x').min(0).max(10).step(0.001).name('uWaveFrequencyX')
gui.add(waterMaterial.uniforms.uWaveFrequency.value, 'y').min(0).max(10).step(0.001).name('uWaveFrequencyY')
gui.add(waterMaterial.uniforms.uWaveSpeed, 'value').min(0.1).max(4).step(0.001).name('uWaveSpeed')

gui.addColor(colorsDebug, 'uDepthColor').onChange(() => {
    waterMaterial.uniforms.uDepthColor.value.set(colorsDebug.uDepthColor)
});

gui.addColor(colorsDebug, 'uSurfaceColor').onChange(() => {
    waterMaterial.uniforms.uSurfaceColor.value.set(colorsDebug.uSurfaceColor)
});

gui.add(waterMaterial.uniforms.uColorOffset, 'value').min(0).max(1).step(0.001).name('uColorOffset')
gui.add(waterMaterial.uniforms.uColorMultiplier, 'value').min(0).max(10).step(0.001).name('uColorMultiplier')

// Mesh
const water = new THREE.Mesh(waterGeometry, waterMaterial)
water.rotation.x = - Math.PI * 0.5
scene.add(water)

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
camera.position.set(1, 1, 1)
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

    waterMaterial.uniforms.uTime.value = elapsedTime


    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()