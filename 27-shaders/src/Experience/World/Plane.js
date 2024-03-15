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
}