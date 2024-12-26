import * as THREE from 'three'
import Experience from '../Experience.js'

export default class Hole
{
    constructor()
    {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.resources = this.experience.resources

        this.setGeometry()
        this.setMaterial()
        this.setMesh()
    }

    setGeometry()
    {
        this.geometry = new THREE.CircleGeometry(2, 32, 32);
    }


    setMaterial()
    {
        this.material = new THREE.MeshStandardMaterial({
            color: 0x000000
        })
    }

    setMesh()
    {
        this.mesh = new THREE.Mesh(this.geometry, this.material)
        this.mesh.receiveShadow = true
        this.mesh.position.y = 0.01
        this.mesh.position.z = -12;
        this.mesh.rotateX(- Math.PI * 0.5)
        
        this.scene.add(this.mesh)
    }
}