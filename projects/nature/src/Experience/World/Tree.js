import * as THREE from 'three'
import Experience from '../Experience.js'

export default class Tree
{
    constructor(resource)
    {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.resources = this.experience.resources
        this.time = this.experience.time
        this.debug = this.experience.debug

        // Debug
        if(this.debug.active)
        {
        }

        // Resource
        this.resource = {...this.resources.items[resource]}

        this.setModel()
    }

    setModel()
    {
        this.model = this.resource.scene.clone()
        // this.model.scale.set(0.2, 0.2, 0.2)

        this.model.traverse((child) =>
        {
            if(child instanceof THREE.Mesh)
            {
                child.castShadow = true
            }
        })
    }

    setPosition(...args)
    {
        this.model.position.set(...args);
    }

    setScale(...args)
    {
        this.model.scale.set(...args);
    }

    addToScene()
    {
        this.scene.add(this.model)
    }

    update()
    {
    }
}