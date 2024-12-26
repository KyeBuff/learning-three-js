import Experience from '../Experience.js'
import Ball from './Ball.js'
import Environment from './Environment.js'
import Floor from './Floor.js'
import Hole from './Hole.js'

export default class World
{
    constructor()
    {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.resources = this.experience.resources

        // Wait for resources
        this.resources.on('ready', () =>
        {

            // Setup
            this.floor = new Floor();
            this.hole = new Hole();
            this.ball = new Ball(this.hole);
            this.environment = new Environment()

            this.handleShadows()
        })


    }

    update()
    {
        if(this.fox)
            this.fox.update()
    }

    handleShadows()
    {
        this.scene.traverse((child) =>
        {
            if(child.isMesh)
            {
                child.castShadow = true
                child.receiveShadow = true
            }
        })
    }
}