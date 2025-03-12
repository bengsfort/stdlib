import { clamp, EPSILON } from '../math/utils.js';
import { IVec2, Vector2 } from '../math/vector2.js';

import { IAABB2D, ICircle, IRay2D } from './primitives.js';

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
  return diff.getMagnitude() <= circle.radius * circle.radius;
}

export function closestPointOnCircle2D(circle: ICircle, point: IVec2): IVec2 {
  const diff = Vector2.Subtract(point, circle.position);

  // If the point is inside of the circle, just return it
  if (diff.getMagnitude() <= circle.radius * circle.radius) {
    return point;
  }

  // Normalize the difference and transform it by the radius
  diff.normalize().multiplyScalar(circle.radius);

  // Finally move the result BACK to world space
  return diff.add(circle.position);
}

export function circleIntersectsCircle2D(a: ICircle, b: ICircle): boolean {
  // Get distance between the centers
  const distanceSquared = Vector2.Subtract(a.position, b.position).getMagnitude();

  // Sum and square the radii so we can compare to the distance
  const summedRadii = a.radius + b.radius;
  return distanceSquared <= summedRadii * summedRadii;
}

export function aabbIntersectsCircle2D(aabb: IAABB2D, circle: ICircle): boolean {
  const closestPoint = closestPointOnAabb2D(aabb, circle.position);
  const distanceSqrd = Vector2.Subtract(circle.position, closestPoint).getMagnitude();
  const radiusSqrd = circle.radius * circle.radius;

  return distanceSqrd <= radiusSqrd;
}

export function isPointOnRay2D(ray: IRay2D, point: IVec2, epsilon = EPSILON): boolean {
  if (Vector2.Equals(ray.position, point)) {
    return true;
  }

  const diff = Vector2.Subtract(point, ray.position).normalize();
  const dot = diff.dot(Vector2.Normalize(ray.direction));

  return Math.abs(1.0 - dot) < epsilon;
}

export function closestPointOnRay2D(ray: IRay2D, point: IVec2): IVec2 {
  // Get the dot of the direction so we can project the point back onto it
  const normalizedDir = Vector2.Normalize(ray.direction);
  const directionDot = Vector2.Dot(normalizedDir, normalizedDir);

  // If the direction vector is zero, the ray is just a point (should not happen)
  if (directionDot === 0) {
    return ray.position;
  }

  const distance = Vector2.Subtract(point, ray.position);
  const projectionScalar = distance.dot(normalizedDir) / directionDot;

  // If the scalar is negative, we are BEHIND the ray and thus the closest point
  // is the origin of the ray, so just return that.
  if (projectionScalar < 0) {
    return ray.position;
  }

  // Scale the distance by the back to find the closest point
  const projection = Vector2.MultiplyScalar(normalizedDir, projectionScalar);
  return projection.add(ray.position);
}

export function rayIntersectsAabb2D(ray: IRay2D, aabb: IAABB2D, collisionPoint = new Vector2()): boolean {
  // @todo
  return false;
}

export function rayIntersectsCircle2D(ray: IRay2D, circle: ICircle, collisionPoint = new Vector2()): boolean {
  // @todo
  return false;
}
