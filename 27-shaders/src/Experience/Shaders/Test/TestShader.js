import * as THREE from 'three'
import vertexShader from './vertexShader.glsl'
import fragmentShader from './fragmentShader.glsl'
import Experience from '../../Experience';

export default class TestShader
{   
    material = null;

    constructor()
    {
        this.experience = new Experience();
        this.debug = this.experience.debug

        this.material = new THREE.RawShaderMaterial({
            vertexShader: vertexShader,
            fragmentShader: fragmentShader,
            uniforms:
            {
                uFrequency: { value: new THREE.Vector2(10, 5) }
            },
        })

        if(this.debug.active)
        {
            this.debugFolder = this.debug.ui.addFolder('planeShader')
            this.debugFolder.add(this.material.uniforms.uFrequency.value, 'x').step(0.01).min(0).max(20).name('frequencyX')
            this.debugFolder.add(this.material.uniforms.uFrequency.value, 'y').step(0.01).min(0).max(20).name('frequencyY')
        }
    }
}