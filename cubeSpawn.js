import * as THREE from 'three';

import { makeMesh } from './utils/three';



const INSET = 0.8;
const BORDER_RADIUS = .12;



function makeDecal(color, side){
    const decalShape = new THREE.Shape();
    decalShape.moveTo(BORDER_RADIUS,0);

    decalShape.lineTo(INSET-BORDER_RADIUS,0); // line

    decalShape.arc(0, BORDER_RADIUS, BORDER_RADIUS, Math.PI*3/2, 0, false); // arc

    decalShape.lineTo(INSET,INSET-BORDER_RADIUS);

    decalShape.arc(-BORDER_RADIUS, 0, BORDER_RADIUS, 0, Math.PI/2);

    decalShape.lineTo(BORDER_RADIUS,INSET);

    decalShape.arc(0,-BORDER_RADIUS, BORDER_RADIUS, Math.PI/2, Math.PI);

    decalShape.lineTo(0,BORDER_RADIUS);

    decalShape.arc(BORDER_RADIUS, 0, BORDER_RADIUS, Math.PI/2, Math.PI*3/2);
    

    const decal = makeMesh({
        geometry: new THREE.ShapeGeometry(decalShape),
        material: new THREE.MeshBasicMaterial({ 
            color,
            polygonOffset: true,
            polygonOffsetFactor: -1,
            polygonOffsetUnits: -1, 
        }),
    })

    decal.position.x = -INSET/2;
    decal.position.y = -INSET/2;
    decal.position.z = .5;

    const pivot = new THREE.Object3D();
    pivot.add(decal);

    switch (side) {
        case 'bottom':
            pivot.rotateX(Math.PI/2);
            break;
        case 'top':
            pivot.rotateX(-Math.PI/2);
            break;
        case 'right':
            pivot.rotateY(Math.PI/2);
            break;
        case 'left': 
            pivot.rotateY(-Math.PI/2);
            break;
        case 'back':
            pivot.rotateY(Math.PI);
            break;
    }

    return pivot;
}



export default function cubeSpawn(faces,position) {

    const box = makeMesh({
        geometry: new THREE.BoxGeometry(1,1,1),
        material: new THREE.MeshBasicMaterial({ color: 0x000000 })
    });
 
    faces.forEach(({color, side}) => {
        const decal = makeDecal(color, side);
        box.add(decal);
    })
    
    const pivot = new THREE.Object3D();
    pivot.add(box);
    box.position.x = position.x;
    box.position.y = position.y;
    box.position.z = position.z;

    return pivot;
}