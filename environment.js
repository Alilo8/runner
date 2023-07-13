import * as THREE from 'three';

export default class Env{
    constructor(scene){
        let plane_geom = new THREE.PlaneGeometry(10, 60);
        plane_geom.rotateX(-Math.PI / 2);
        let plane_mat = new THREE.MeshMatcapMaterial({color: 0x967b00});
        this.plane_mesh = new THREE.InstancedMesh(plane_geom, plane_mat, 5);
        this.plane_mesh.position.y -= 1;

        const temp = new THREE.Object3D();
        for(let i = 0; i<5; i++){
            temp.position.set(0, 0, i*60)
            temp.updateMatrix();
            this.plane_mesh.setMatrixAt(i, temp.matrix);
            this.plane_mesh.setColorAt(i, new THREE.Color(Math.random() * 0xffffff ))
        }
        scene.add(this.plane_mesh);
    }
    changePosition(){
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
    }
}