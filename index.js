import * as THREE from 'three';
import Stats from "Stats";
import { OrbitControls } from "OrbitControls";
import { EffectComposer } from "EffectComposer";
import { RenderPass } from 'RenderPass';
import { UnrealBloomPass } from 'UnrealBloomPass';
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
        const fullscreen_btn = document.querySelector('.button')
        const body = document.getElementsByTagName('body')
        fullscreen_btn.onclick = (e) => {
            if(document.fullscreenElement)
                document.exitFullscreen()
            else
                body[0].requestFullscreen()
        }
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
        // this.scene.background = new THREE.Color( 0x000066 );
        const loader = new THREE.CubeTextureLoader();
        loader.setPath( 'assets/' );
        const texture = loader.load( [
            'px.png', 'nx.png',
            'nz.png', 'pz.png',
            'ny.png', 'py.png'
        ] );
        this.scene.background = texture
        this.scene.fog = new THREE.Fog( 0x000000, 0, 500 );

        // const ambientLight = new THREE.AmbientLight( 0xcccccc );
        // this.scene.add( ambientLight );
        const directionalLight = new THREE.DirectionalLight( 0x888888, 1 );
        // directionalLight.position.set( 1, 1, 1.5 ).normalize();
        directionalLight.position.set(10, 10, 0);
        directionalLight.lookAt(0, 0, 0)
        this.scene.add( directionalLight );
        
        let pointLight = new THREE.PointLight( 0x888888, 1 );
        // pointLight.position.set( 1, 1, 1.5 ).normalize();
        // pointLight.position.set(0, 10, 200);
        // pointLight.lookAt(0, 0, 0)
        // this.scene.add( pointLight );

        // pointLight = new THREE.PointLight( 0x888888, 1 );
        pointLight.position.set(0, 10, -5);
        pointLight.lookAt(0, 0, 0)
        pointLight.castShadow = true;
        this.scene.add( pointLight );
        
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
        this.renderer.shadowMap.enabled = true;
        this.renderer.setSize(this.winSize.width, this.winSize.height);
        // this.controls = new OrbitControls(this.camera, canvas);
        this.canvas = canvas;

        THREE.ColorManagement.enabled = true
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping
        const target = new THREE.WebGLRenderTarget(this.winSize.width, this.winSize.height, {
        type: THREE.HalfFloatType,
        format: THREE.RGBAFormat,
        })
        target.samples = 8
        this.composer = new EffectComposer( this.renderer, target)
        this.composer.addPass(new RenderPass(this.scene, this.camera))
        // Setting threshold to 1 will make sure nothing glows
        this.composer.addPass(new UnrealBloomPass(undefined, 1, 1, 1))
    }
    loop(){
        this.renderer.setAnimationLoop(() => {
            this.delta += 1;
            if(this.delta % this.FPS == 0){
                this.env.addObs();
            }

            this.stats.update();
            // this.controls.update();
            
            // this.renderer.render(this.scene, this.camera)
            this.composer.render()
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