import * as THREE from 'three';

export default class Player{
    constructor(scene){
        const geom = new THREE.BoxGeometry();
        const mat = new THREE.MeshMatcapMaterial();
        const box = new THREE.Mesh(geom, mat);
        scene.add(box)
        window.addEventListener('keypress', (e) => {
            if(e.code === "KeyA"){
                if(box.position.x < 2)
                    box.position.x += 2;
            }
            if(e.code === "KeyD")
                if(box.position.x > -2)
                    box.position.x -= 2;
        })
    }

}