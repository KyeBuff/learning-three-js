import * as THREE from 'three'
import vertexShader from './vertexShader.glsl'
import fragmentShader from './fragmentShader.glsl'

export default class TestShader
{   
    material = null;

    constructor()
    {
        this.material = new THREE.RawShaderMaterial({
            vertexShader: vertexShader,
            fragmentShader: fragmentShader
        })
    }
}