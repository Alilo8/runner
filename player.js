import * as THREE from 'three';

export default class Player{
    constructor(scene){
        this.inAir = false;
        this.duck = false;
        this.velocity = -0.01;
        this.g = 0.005;
        this.choice = [-2, 0, 2];
        this.move = false;
        this.move_vert = 0;
        this.move_hor = 0;

        const geom = new THREE.SphereGeometry();
        const texture = new THREE.TextureLoader().load('assets/fire.png')
        const mat = new THREE.MeshStandardMaterial({color: 'white', roughness: 0, map: texture});
        this.box = new THREE.Mesh(geom, mat);
        this.box.castShadow = true;

        scene.add(this.box)
        
        this.initEventListeners();
    }
    initEventListeners(){
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
            if(e.code === "KeyS"){
                this.duck = true;
                setTimeout(() => {this.duck = false; console.log(this.duck)}, 3000)
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
                        if(diffY > 0){
                            this.inAir = true;
                            this.velocity = 0.2;
                            this.g = -0.005;
                        }
                        else{
                            this.duck = true;
                            setTimeout(() => {this.duck = false; console.log(this.duck)}, 3000);
                        }
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
        this.box.rotateX(0.3)
    }
    checkCollision(collision_space){
        if(this.inAir && !collision_space[1][this.choice.indexOf(this.box.position.x)])
            return true
        else if(this.duck && !collision_space[0][this.choice.indexOf(this.box.position.x)])
            return true
        else if(collision_space[0][this.choice.indexOf(this.box.position.x)] || collision_space[1][this.choice.indexOf(this.box.position.x)])
            return false
        return true;
    }



}