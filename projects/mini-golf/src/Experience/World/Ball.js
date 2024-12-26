import * as THREE from "three";
import Experience from "../Experience.js";
import gsap from "gsap";

export default class Ball {
  constructor(hole) {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.resources = this.experience.resources;
    this.debug = this.experience.debug;
    this.hole = hole;

    this.setGeometry();
    this.setMaterial();
    this.setMesh();

    if (this.debug.active) {
      this.debugFolder = this.debug.ui.addFolder("ball");

      const debugObject = {
        hitBall: () => {
            const distance = this.mesh.position.distanceTo(hole.mesh.position);

            gsap.to(this.mesh.position, { 
                duration: 1, 
                z: -(Math.random() * distance) * 0.5,
                onComplete: this.ballStoppedMoving.bind(this)
            }); 
        },
      };
      this.debugFolder.add(debugObject, "hitBall");
    }
  }

    ballStoppedMoving() {
        const distance = this.mesh.position.distanceTo(this.hole.mesh.position);
        if (distance < 3) {
            gsap.to(this.mesh.position, { duration: 1, y: -5 });
        }
    }

  setGeometry() {
    this.geometry = new THREE.SphereGeometry(1, 32, 32);
  }

  setMaterial() {
    this.material = new THREE.MeshStandardMaterial({
      color: 0xffffff,
    });
  }

  setMesh() {
    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.mesh.receiveShadow = true;
    this.mesh.position.y = 1;
    this.mesh.position.z = 14;

    this.scene.add(this.mesh);
  }
}
