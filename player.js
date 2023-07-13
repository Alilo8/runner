import * as THREE from 'three';

export default class Player{
    constructor(scene){
        this.inAir = false;
        this.velocity = -0.01;
        this.g = 0.005;
        this.choice = [-2, 0, 2]
        this.move = false;
        this.move_vert = 0;
        this.move_hor = 0;

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
        window.addEventListener('touchstart', e => {
            ;[...e.changedTouches].forEach(touch => {
                if(touch.pageY > 300){
                    this.move = true;
                    this.move_vert = touch.pageY;
                    this.move_hor = touch.pageX;
                }
            })
        })
        window.addEventListener('touchend', (e) => {
            ;[...e.changedTouches].forEach(touch => {

                if(this.move){
                    const diffX = this.move_hor - touch.pageX;
                    const diffY = this.move_vert - touch.pageY;

                    if(Math.abs(diffX) > Math.abs(diffY)){
                        if(diffX > 0)
                            this.box.position.x += 2;
                        else
                            this.box.position.x -= 2;
                    }
                    else{
                        this.inAir = true;
                        this.velocity = 0.2;
                        this.g = -0.005;
                    }
                    this.move = false;
                }
            })
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
    checkCollision(collision_space){
        if(collision_space[this.choice.indexOf(this.box.position.x)] == 1){
            return false;
        }
        return true;
    }



}