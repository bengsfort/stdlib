import type { IVec2 } from '../math/vector2.js';
import type { IVec3 } from '../math/vector3.js';

import type { IAABB, ICircle } from './primitives.js';

export function aabbContainsPoint2D(bounds: IAABB, point: IVec2): boolean {
  const half: IVec2 = {
    x: bounds.size.x * 0.5,
    y: bounds.size.y * 0.5,
  };

  return (
    point.x >= bounds.position.x - half.x &&
    point.x <= bounds.position.x + half.x &&
    point.y >= bounds.position.y - half.y &&
    point.y <= bounds.position.y + half.y
  );
}

export function aabbContainsPoint3D(bounds: IAABB, point: IVec3): boolean {
  const half: IVec3 = {
    x: bounds.size.x * 0.5,
    y: bounds.size.y * 0.5,
    z: bounds.size.z * 0.5,
  };

  return (
    point.x >= bounds.position.x - half.x &&
    point.x <= bounds.position.x + half.x &&
    point.y >= bounds.position.y - half.y &&
    point.y <= bounds.position.y + half.y &&
    point.z >= bounds.position.z - half.z &&
    point.z <= bounds.position.z + half.z
  );
}

export function aabbIntersectsAabb(a: IAABB, b: IAABB): boolean {
  // @todo
  return false;
}

export function aabbIntersectsSphere(a: IAABB, b: ICircle): boolean {
  // @todo
  return false;
}

export function sphereContainsPoint2D(sphere: ICircle, point: IVec2): boolean {
  // @todo
  return false;
}

export function sphereContainsPoint3D(sphere: ICircle, point: IVec3): boolean {
  // @todo
  return false;
}

export function sphereIntersectsSphere(a: ICircle, b: ICircle): boolean {
  // @todo
  return false;
}
