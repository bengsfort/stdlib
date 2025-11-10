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

export function rayIntersectsAabb2D(
  ray: IRay2D,
  aabb: IAABB2D,
  collisionPoint = new Vector2(),
): boolean {
  // Early out if ray starts inside of the box
  // NOTE: This doesnt feel nice, i believe ther should be a way to do this
  // using the below calculations, but this works for now. Revisit.
  if (aabbContainsPoint2D(aabb, ray.position)) {
    collisionPoint.set(ray.position.x, ray.position.y);
    return true;
  }

  const normal = Vector2.Normalize(ray.direction);

  // Solve for different `t` cases, ie. the min and max points where the ray
  // intersects with the planes that surround the AABB. This is a scalar that
  // can be multiplied by the normal to get a position along the ray.
  // `0` would be the origin of the ray.
  const xMin = (aabb.min.x - ray.position.x) / normal.x;
  const xMax = (aabb.max.x - ray.position.x) / normal.x;
  const yMin = (aabb.min.y - ray.position.y) / normal.y;
  const yMax = (aabb.max.y - ray.position.y) / normal.y;

  // Determine the ray entrance by getting the biggest MINIMUM value
  const entranceT = Math.max(Math.min(xMin, xMax), Math.min(yMin, yMax));
  // Determine ray exit by getting the smallest MAXIMUM value
  const exitT = Math.min(Math.max(xMin, xMax), Math.max(yMin, yMax));

  // If the exit is greater than 0 the ray is behind the AABB
  if (exitT < 0) {
    return false;
  }

  // if entrance > exit, there is no intersection
  if (entranceT > exitT) {
    return false;
  }

  collisionPoint.set(ray.position.x, ray.position.y);
  const t = entranceT < 0 ? exitT : entranceT;
  normal.multiplyScalar(t);
  collisionPoint.add(normal);

  return true;
}

export function rayIntersectsCircle2D(
  ray: IRay2D,
  circle: ICircle,
  collisionPoint = new Vector2(),
): boolean {
  const normal = Vector2.Normalize(ray.direction);
  const radiusSqr = circle.radius * circle.radius;

  const distance = Vector2.Subtract(circle.position, ray.position);
  const distanceSquared = distance.getMagnitude();

  // If the distance is less than the radius, the ray is inside
  if (distanceSquared < radiusSqr) {
    collisionPoint.set(ray.position.x, ray.position.y);
    return true;
  }

  // Project the ray to the plane of the center of the circle
  const projectionToCenter = distance.dot(normal);
  const projSqr = projectionToCenter * projectionToCenter;

  // If the result is negative then there is no collision
  if (radiusSqr - distanceSquared + projSqr < 0) {
    return false;
  }

  const centerToRayProj = Math.sqrt(distanceSquared - projSqr);
  const rayProjToCollision = Math.sqrt(radiusSqr - centerToRayProj * centerToRayProj);
  const collision = projectionToCenter - rayProjToCollision;

  // Project the result back onto the ray as the collision point
  collisionPoint.set(ray.position.x, ray.position.y);
  normal.multiplyScalar(collision);
  collisionPoint.add(normal);

  return true;
}
