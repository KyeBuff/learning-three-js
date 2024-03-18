import * as THREE from 'three'
import Experience from '../Experience.js'
import TestShader from '../Shaders/Test/TestShader.js'

export default class Plane
{
    constructor()
    {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.resources = this.experience.resources

        this.setGeometry()
        this.setTextures()
        this.setMaterial()
        this.setMesh()
        this.setDeviations()
    }

    setGeometry()
    {
        this.geometry = new THREE.PlaneGeometry(1, 1, 32, 32)
    }

    setTextures()
    {
    }

    setMaterial()
    {
        this.material = new TestShader().material;
    }

    setMesh()
    {
        this.mesh = new THREE.Mesh(this.geometry, this.material)
        this.scene.add(this.mesh)
    }

    setDeviations()
    {
        const count = this.geometry.attributes.position.count;
        const deviations = new Float32Array(count);

        for (let i = 0; i < count; i++)
        {
            deviations[i] = Math.random();
        }

        this.geometry.setAttribute('aDeviations', new THREE.BufferAttribute(deviations, 1));
    }
}