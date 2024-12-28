import * as THREE from 'three'
import Experience from '../Experience.js'
import TestShader from '../Shaders/Test/TestShader.js'

export default class Moth
{
    constructor()
    {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.resources = this.experience.resources
        this.time = this.experience.time
        this.debug = this.experience.debug

        // Debug
        if(this.debug.active)
        {
            this.debugFolder = this.debug.ui.addFolder('moth')
        }

        // Resource
        this.resource = this.resources.items.fox

        this.setShader()
        this.setModel()
    }

    setShader()
    {
        const shader = new TestShader();
        this.material = shader.material;
    }

    setModel()
    {
        // this.model = new THREE.CylinderGeometry(0.5, 0.5, 1, 32);
        // this.mesh = new THREE.Mesh(this.model, this.material);

        this.model = this.resource.scene;

        // // Add shader to model
        this.model.traverse((child) =>
        {
            if(child.isMesh)
            {
                child.material = this.material
                console.log(child);
            }
        })

        this.model.scale.set(0.02, 0.02, 0.02)

        this.scene.add(this.model)
    }

    update()
    {
    }
}