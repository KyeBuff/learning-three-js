import * as THREE from 'three'
import vertexShader from './vertexShader.glsl'
import fragmentShader from './fragmentShader.glsl'
import Experience from '../../Experience';
import EventEmitter from '../../Utils/EventEmitter';

export default class TestShader extends EventEmitter
{   
    material = null;

    constructor()
    {
        super();
        this.experience = new Experience();
        this.resources = this.experience.resources;

        this.debug = this.experience.debug

        const flag = this.resources.items.flagTexture

        this.material = new THREE.ShaderMaterial({
            vertexShader: vertexShader,
            fragmentShader: fragmentShader,
            uniforms:
            {
                uFrequency: { value: new THREE.Vector2(10, 5) },
                uTime: { value: 0 },
                uColor: { value: new THREE.Color('yellow') },
                uTexture: { value: flag },
            },
        })


        if(this.debug.active)
        {
            this.debugFolder = this.debug.ui.addFolder('planeShader')
            this.debugFolder.add(this.material.uniforms.uFrequency.value, 'x').step(0.01).min(0).max(20).name('frequencyX')
            this.debugFolder.add(this.material.uniforms.uFrequency.value, 'y').step(0.01).min(0).max(20).name('frequencyY')
        }

        this.experience.time.on('tick', () =>
        {
            this.material.uniforms.uTime.value = this.experience.time.elapsed * 0.01
        });
    }
}