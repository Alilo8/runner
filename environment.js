import * as THREE from 'three';

export default class Env{
    constructor(scene){
        const plane_geom = new THREE.PlaneGeometry(10, 60);
        plane_geom.rotateX(-Math.PI / 2);
        const plane_mat = new THREE.MeshMatcapMaterial({color: 0xffffff});
        this.plane_mesh = new THREE.InstancedMesh(plane_geom, plane_mat, 5);
        this.plane_mesh.position.y -= 1;

        const temp = new THREE.Matrix4();
        for(let i = 0; i<5; i++){
            temp.setPosition(0, 0, i*60)
            this.plane_mesh.setMatrixAt(i, temp);
            this.plane_mesh.setColorAt(i, new THREE.Color(Math.random() * 0xffffff ))
        }
        scene.add(this.plane_mesh);

        const choice = [-2, 0, 2]
        const geom = new THREE.BoxGeometry();
        const mat = new THREE.MeshMatcapMaterial({color: 0xffffff});
        this.obstacle_mesh = new THREE.InstancedMesh(geom, mat, 20);
        this.obstacle_mesh.count = 0;
        scene.add(this.obstacle_mesh)
        
    }
    update(){
        const temp = new THREE.Object3D();
        const matrix = new THREE.Matrix4()
        for(let i = 0; i<5; i++){
            this.plane_mesh.getMatrixAt(i, matrix)
            matrix.decompose(temp.position, temp.quaternion, temp.scale)
            if(temp.position.z < -35)
                temp.position.z = 263;
            else
                temp.position.z -= 1;
            temp.updateMatrix();
            this.plane_mesh.setMatrixAt(i, temp.matrix);
            this.plane_mesh.instanceMatrix.needsUpdate = true;
        }

        const choice = [-2, 0, 2]
        for(let i = 0; i<this.obstacle_mesh.count; i++){
            this.obstacle_mesh.getMatrixAt(i, matrix)
            matrix.decompose(temp.position, temp.quaternion, temp.scale)
            if(temp.position.z < -35)
                temp.position.set(choice[Math.round(Math.random() * 2)], 0, 343)
            else
                temp.position.z -= 1;
            temp.updateMatrix();
            this.obstacle_mesh.setMatrixAt(i, temp.matrix);
            this.obstacle_mesh.instanceMatrix.needsUpdate = true;
        }
        
    }
    addObs(){
        const temp = new THREE.Matrix4()
        const choice = [-2, 0, 2]
        const count = this.obstacle_mesh.count;
        if(count < 20){
                for(let i = count; i<count+2; i++){
                    temp.setPosition(choice[Math.round(Math.random() * 2)], 0, 263)
                    this.obstacle_mesh.setMatrixAt(i, temp);
                    this.obstacle_mesh.setColorAt(i, new THREE.Color(0xff0000 ))
                    this.obstacle_mesh.instanceMatrix.needsUpdate = true;
                    this.obstacle_mesh.instanceColor.needsUpdate = true;
                }
            this.obstacle_mesh.count += 2;
        }
    }
}