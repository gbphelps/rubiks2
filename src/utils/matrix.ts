import * as THREE from 'three';
import {
  Matrix, Mx4, Vec2,
} from './types';

function flatten<T>(
  mx: (T | T[])[],
): T[] {
  return mx.reduce<T[]>((acc, el) => {
    if (Array.isArray(el)) {
      return acc.concat(flatten(el));
    }
    return acc.concat(el);
  }, []);
}

export function Matrix2Tuple(mx: Matrix) {
  const typedValues: Mx4 = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  const values = flatten(mx);
  for (let i = 0; i < values.length; i++) {
    typedValues[i] = values[i];
  }
  return typedValues;
}

export function Matrix2Vec(mx: Matrix) {
  return {
    x: mx[0][0],
    y: mx[1][0],
    z: mx[2][0],
  };
}

export function Vec2Matrix(vec: THREE.Vector3) {
  return [[vec.x], [vec.y], [vec.z], [1]];
}

export function XProd(v1: THREE.Vector3, v2: THREE.Vector3) {
  const { x: x1, y: y1, z: z1 } = v1;
  const { x: x2, y: y2, z: z2 } = v2;
  return {
    x: y1 * z2 - z1 * y2,
    y: z1 * x2 - x1 * z2,
    z: x1 * y2 - y1 * x2,
  };
}

export function dotProd(v1: Vec2 | THREE.Vector3, v2: Vec2 | THREE.Vector3) {
  const a = {
    z: 0,
    ...v1,
  };

  const b = {
    z: 0,
    ...v2,
  };

  return a.x * b.x + a.y * b.y + a.z * b.z;
}

export function mag2(vec: THREE.Vector3) {
  return vec.x * vec.x + vec.y * vec.y + vec.z * vec.z;
}

export function vec3(vec: Vec2) {
  return {
    ...vec,
    z: 0,
  };
}

export function X(m1: Matrix, m2: Matrix): Matrix {
  const result: Matrix = [];
  for (let i = 0; i < m1.length; i++) {
    const r = [];
    for (let j = 0; j < m2[0].length; j++) {
      r.push(0);
    }
    result.push(r);
  }

  if (m1[0].length !== m2.length) throw new Error('dimensional mismatch');

  for (let row = 0; row < m1.length; row++) {
    for (let col = 0; col < m2[0].length; col++) {
      let sum = 0;
      for (let k = 0; k < m1[0].length; k++) {
        sum += m1[row][k] * m2[k][col];
      }
      result[row][col] = sum;
    }
  }
  return result;
}

export function Rx(t: number) {
  return [
    [1, 0, 0, 0],
    [0, Math.cos(t), -Math.sin(t), 0],
    [0, Math.sin(t), Math.cos(t), 0],
    [0, 0, 0, 1],
  ];
}

export function Ry(t: number) {
  return [
    [Math.cos(t), 0, Math.sin(t), 0],
    [0, 1, 0, 0],
    [-Math.sin(t), 0, Math.cos(t), 0],
    [0, 0, 0, 1],
  ];
}

export function Rz(t: number) {
  return [
    [Math.cos(t), -Math.sin(t), 0, 0],
    [Math.sin(t), Math.cos(t), 0, 0],
    [0, 0, 1, 0],
    [0, 0, 0, 1],
  ];
}

export function unitVector() {
  return [
    [1, 0, 0, 0],
    [0, 1, 0, 0],
    [0, 0, 1, 0],
    [0, 0, 0, 1],
  ];
}

export function Vec3toTHREE(vec: THREE.Vector3) {
  const v = new THREE.Vector3();
  v.set(
    vec.x,
    vec.y,
    vec.z,
  );
  return v;
}

export function Matrix3toTHREE() {}
