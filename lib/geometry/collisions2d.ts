import { clamp } from '../math/utils.js';
import { IVec2, Vector2 } from '../math/vector2.js';

import { IAABB2D, ICircle } from './primitives.js';

export function aabbContainsPoint2D(bounds: IAABB2D, point: IVec2): boolean {
  return (
    point.x >= bounds.min.x &&
    point.x <= bounds.max.x &&
    point.y >= bounds.min.y &&
    point.y <= bounds.max.y
  );
}

export function aabbIntersectsAabb2D(a: IAABB2D, b: IAABB2D): boolean {
  return (
    a.min.x <= b.max.x && a.max.x >= b.min.x && a.min.y <= b.max.y && a.max.y >= b.min.y
  );
}

export function closestPointOnAabb2D(a: IAABB2D, point: IVec2): IVec2 {
  return new Vector2(clamp(point.x, a.min.x, a.max.x), clamp(point.y, a.min.y, a.max.y));
}

export function aabbIntersectsCircle2D(a: IAABB2D, b: ICircle): boolean {
  // @todo
  return false;
}

export function closestPointOnCircle2D(a: ICircle, point: IVec2): boolean {
  // @todo
  return false;
}

export function circleContainsPoint2D(circle: ICircle, point: IVec2): boolean {
  return false;
}

export function circleIntersectsCircle2D(a: ICircle, b: ICircle): boolean {
  return false;
}
