import * as THREE from 'three';
import Stats from "Stats";
import { OrbitControls } from "OrbitControls";
import Env from './environment.js';
import Player from './player.js';

class Game{
    constructor(){
        this.scene = new THREE.Scene();
        this.delta = 0;
        this.FPS = 50;
        this.play = true;

        this.getWinSize();
        this.initFPS();
        this.initLight();
        this.initCamera();
        this.initAction();
        this.initEvenListeners();
        this.env = new Env(this.scene);
        this.player = new Player(this.scene);
        
    }
    initEvenListeners(){
        window.addEventListener('resize', () => {
            this.getWinSize();
            this.canvas.width = this.winSize.width;
            this.canvas.height = this.winSize.height;
            this.camera.aspect = this.winSize.width / this.winSize.height;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(this.winSize.width, this.winSize.height);
        });
        window.addEventListener('keypress', (e) => {
            if(e.code === "KeyP")
                this.play = !this.play;
        })
    }
    getWinSize(){
        this.winSize = {
            width: window.innerWidth,
            height: window.innerHeight
        }
    }
    initFPS(){
        this.stats = new Stats();
        this.stats.showPanel(0);
        document.body.append(this.stats.dom);
    }
    initLight(){
        this.scene.background = new THREE.Color( 0x00aaff );
        this.scene.fog = new THREE.Fog( 0x00aaff, 0, 500 );

        // const ambientLight = new THREE.AmbientLight( 0xcccccc );
        // this.scene.add( ambientLight );
        const directionalLight = new THREE.DirectionalLight( 0xffffff, 2 );
        // directionalLight.position.set( 1, 1, 1.5 ).normalize();
        directionalLight.position.set(0, 10, 10);
        this.scene.add( directionalLight );
        // const ambientLight = new THREE.AmbientLight();
        // this.scene.add(ambientLight);
      }
    initCamera(){
        this.camera = new THREE.PerspectiveCamera(45, this.winSize.width / this.winSize.height);
        this.camera.position.set(0, 5, -13);
        this.camera.lookAt(0, 0, 20);
        this.scene.add(this.camera);
    }
    initAction(){
        const canvas = document.querySelector('.webgl');
        this.renderer = new THREE.WebGLRenderer({ canvas });
        this.renderer.setSize(this.winSize.width, this.winSize.height);
        // this.controls = new OrbitControls(this.camera, canvas);
        this.canvas = canvas;
    }
    loop(){
        this.renderer.setAnimationLoop(() => {
            this.delta += 1;
            if(this.delta % this.FPS == 0){
                this.env.addObs();
            }

            this.stats.update();
            // this.controls.update();
            
            this.renderer.render(this.scene, this.camera)
            if(this.play){
                const collision_space = this.env.update();
                this.player.update();
                this.play = this.player.checkCollision(collision_space);
            }
        })
    }
}


const game = new Game();
game.loop();