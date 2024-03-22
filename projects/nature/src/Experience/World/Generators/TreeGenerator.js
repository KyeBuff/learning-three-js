import Experience from "../../Experience";
import Tree from "../Tree";

export default class TreeGenerator {
    constructor(count = 1) {
        this.experience = new Experience();
        this.world = this.experience.world;
        this.floor = this.world.floor;


        this.count = count;
        this.trees = [];
        for(let i = 0; i < count; i++) {
            const tree = new Tree('tree');
            tree.setPosition(
                Math.sin(i) * (this.floor.radius - 5), 
                0, 
                Math.cos(i) * (this.floor.radius - 5)
                );
            
            const radius = Math.random() * 1.25 + 0.5;
            const height = Math.random() * 1.1 + .5;
            tree.setScale(radius, height, radius);

            tree.addToScene();
            this.trees.push(tree);
        }

    }
    
}