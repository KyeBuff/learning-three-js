import Experience from '../Experience.js'
import Environment from './Environment.js'
import Plane from './Plane.js'

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
            this.plane = new Plane()
            this.environment = new Environment()
        })
    }

    update()
    {
    }
}