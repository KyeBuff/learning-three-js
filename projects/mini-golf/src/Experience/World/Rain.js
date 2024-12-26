import * as THREE from 'three'
import Experience from "../Experience";
import EventEmitter from '../Utils/EventEmitter';

export default class Rain extends EventEmitter {
    constructor(count = 500) {
        super();
        this.experience = new Experience();
        this.world = this.experience.world;
        this.floor = this.world.floor;
        this.time = this.experience.time;
        this.count = count;

        this.setRaindrops();
        this.setGeometry();
        this.setMaterial();
        this.addToScene();

        this.time.on('tick', () => {
            this.rainfall();
        });
    }

    setGeometry() {
        this.geometry = new THREE.BufferGeometry();
        this.geometry.setAttribute('position', this.raindrops);
    }

    setRaindrops()
    {
        const raindrops = new Float32Array(this.count * 3);
        const attribute = new THREE.BufferAttribute(raindrops, 3);

        for (let i=0; i < this.count; i++) {
            // x
            raindrops[i * 3] = Math.sin(i) * (this.floor.radius) * Math.random()
            // y
            raindrops[i * 3 + 1] = (Math.random() * 40);
            // z
            raindrops[i * 3 + 2] = Math.cos(i) * (this.floor.radius) * Math.random();
        }

        this.raindrops = attribute;
    }

    setMaterial() {
        this.material = new THREE.PointsMaterial({
            size: 0.3,
            sizeAttenuation: true,
            depthWrite: false,
            blending: THREE.AdditiveBlending,
            vertexColors: false,
            color: 0xffffff,
            opacity: 0.5,
        });
    }

    addToScene() {
        this.rain = new THREE.Points(this.geometry, this.material);
        this.experience.scene.add(this.rain);
    }

    rainfall() {
        const positionAttributes = this.geometry.attributes.position;

        const vertex = new THREE.Vector3();

        for ( let i = 0; i < positionAttributes.count; i ++ ) {

            vertex.fromBufferAttribute( positionAttributes, i );

            vertex.y = vertex.y <= 0 ? 40 : vertex.y - .4;
            
            positionAttributes.setXYZ( i, vertex.x, vertex.y, vertex.z );
        
        }
        
        positionAttributes.needsUpdate = true;
    }
}