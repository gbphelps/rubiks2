import * as THREE from 'three';
import { Axis, axes } from '../utils/types';
import faceManager from '../faceManager';
import { globals } from '../globals';

export default function updateRegistry(
  tranche: (THREE.Object3D | null)[],
) {
  tranche.forEach((box) => {
    if (!box) throw new Error();
    const child = box.children[0];
    const mx = box.matrix.clone();
    box.rotation.set(0, 0, 0);
    child.applyMatrix4(mx);
    roundPosition(child);
    const { x, y, z } = child.position;
    globals.cube.registry.registerBox(new THREE.Vector3(x + 1, y + 1, z + 1), box);
  });

  faceManager.updateFaces();
  globals.action.setAction(null);
}

function rotateChild(child: THREE.Object3D, axis: Axis, rotation: number) {
  const a = getRotationMatrix(axis, rotation);
  const m = child.matrix;
  const b = (new THREE.Matrix4()).multiplyMatrices(a, m);
  child.setRotationFromMatrix(b);
  roundRotation(child);
}

function mod(x: number, m: number) {
  if (x % m >= 0) return Math.abs(x % m); return m + x % m;
}

function roundRotation(obj: THREE.Object3D) {
  // note: THREEjs already takes the 2pi modulus for angles over 2pi
  for (let i = 0; i < 3; i++) {
    const axis = axes[i];
    const oneRotation = Math.PI / 2;
    const turns = Math.round(obj.rotation[axis] / oneRotation);
    obj.rotation[axis] = mod(turns, 4) * oneRotation;
  }
}

function roundPosition(obj: THREE.Object3D) {
  for (let i = 0; i < 3; i++) {
    const axis = axes[i];
    obj.position[axis] = Math.round(obj.position[axis]);
  }
}

function getRotationMatrix(axis: Axis, rotation: number) {
  const rotations: Record<string, 'makeRotationX' | 'makeRotationY' | 'makeRotationZ'> = {
    x: 'makeRotationX',
    y: 'makeRotationY',
    z: 'makeRotationZ',
  };
  const mx = new THREE.Matrix4();
  mx[rotations[axis]](rotation);
  return mx;
}

export function shuffle(times: number) {
  for (let i = 0; i < times; i++) {
    const axis = Math.floor(Math.random() * 3);
    const rotation = (Math.floor(Math.random() * 3) + 1) * Math.PI / 2;
    const layer = Math.floor(Math.random() * 3);
    const tranche = globals.cube.registry.getTrancheStatic(axis, layer);
    const rotMx = getRotationMatrix(axes[axis], rotation);
    tranche.forEach((box) => {
      if (!box) throw new Error();
      const child = box.children[0];
      rotateChild(child, axes[axis], rotation);

      child.position.applyMatrix4(rotMx);
      roundPosition(child);
      child.updateMatrix();

      const { x, y, z } = child.position;
      globals.cube.registry.registerBox(new THREE.Vector3(x + 1, y + 1, z + 1), box);
    });
  }

  faceManager.updateFaces();
}
