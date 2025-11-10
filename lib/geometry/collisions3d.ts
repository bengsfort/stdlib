import type { IVec2 } from '../math/vector2.js';
import type { IVec3 } from '../math/vector3.js';

import type { IAABB, IAABB2D, ICircle, ISphere } from './primitives.js';

export function aabbContainsPoint3D(bounds: IAABB, point: IVec3): boolean {
  return (
    point.x >= bounds.min.x &&
    point.x <= bounds.max.x &&
    point.y >= bounds.min.y &&
    point.y <= bounds.max.y &&
    point.z >= bounds.min.z &&
    point.z <= bounds.max.z
  );
}

export function aabbIntersectsAabb3D(a: IAABB, b: IAABB): boolean {
  return (
    a.min.x <= b.max.x &&
    a.max.x >= b.min.x &&
    a.min.y <= b.max.y &&
    a.max.y >= b.min.y &&
    a.min.z <= b.max.z &&
    a.max.z >= b.min.z
  );
}

export function aabbIntersectsSphere3D(a: IAABB, b: ISphere): boolean {
  return false;
}

export function sphereContainsPoint3D(sphere: ISphere, point: IVec3): boolean {
  // @todo
  return false;
}

export function sphereIntersectsSphere3D(a: ISphere, b: ISphere): boolean {
  // @todo
  return false;
}
