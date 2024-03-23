import Experience from '../Experience.js'
import Environment from './Environment.js'
import Floor from './Floor.js'
import TreeGenerator from './Generators/TreeGenerator.js'
import Rain from './Rain.js'
import Tree from './Tree.js'

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
            this.environment = new Environment()
            this.trees = new TreeGenerator(10);
            this.rain = new Rain();

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