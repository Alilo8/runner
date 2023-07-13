import * as THREE from 'three';

export default class Player{
    constructor(scene){
        this.inAir = false;
        this.velocity = -0.01;
        this.g = 0.005;
        const geom = new THREE.BoxGeometry();
        const mat = new THREE.MeshMatcapMaterial();
        this.box = new THREE.Mesh(geom, mat);
        scene.add(this.box)
        window.addEventListener('keypress', (e) => {
            if(e.code === "KeyA" && this.box.position.x < 2)
                this.box.position.x += 2;
            if(e.code === "KeyD" && this.box.position.x > -2)
                this.box.position.x -= 2;
            if(e.code === "KeyW" && this.box.position.y < 2){
                this.inAir = true;
                this.velocity = 0.2;
                this.g = -0.005;
            }
        })
    }
    update(){
        if(this.inAir){
            this.box.position.y += this.velocity;
            this.velocity += this.g;
            if(this.box.position.y < 0){
                this.inAir = false;
                this.box.position.y = 0;
            }
            else if(this.box.position >= 4){
                this.velocity *= -1;
                this.g *= -1;
            }
        }
    }



}