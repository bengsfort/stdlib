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

export function circleContainsPoint2D(circle: ICircle, point: IVec2): boolean {
  const diff = Vector2.Subtract(circle.position, point);
  return diff.getMagnitude() < circle.radius * circle.radius;
}

export function closestPointOnCircle2D(circle: ICircle, point: IVec2): IVec2 {
  const diff = Vector2.Subtract(point, circle.position);

  // If the point is inside of the circle, just return it
  if (diff.getMagnitude() < circle.radius * circle.radius) {
    return point;
  }

  // Normalize the difference and transform it by the radius
  diff.normalize().multiplyScalar(circle.radius);

  // Finally move the result BACK to world space
  return diff.add(circle.position);
}

export function circleIntersectsCircle2D(a: ICircle, b: ICircle): boolean {
  return false;
}

export function aabbIntersectsCircle2D(a: IAABB2D, b: ICircle): boolean {
  // @todo
  return false;
}
