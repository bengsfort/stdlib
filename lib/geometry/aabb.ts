import { IVec3, Vector3 } from '../math/vector3.js';

import { IAABB } from './primitives.js';

interface IAABBExtents {
  half: Vector3;
  min: Vector3;
  max: Vector3;
}

export function calculateExtentsAABB(aabb: IAABB, cachedHalf?: Vector3): IAABBExtents {
  const half = cachedHalf ?? new Vector3(aabb.size).divideScalar(2);

  return {
    half,
    min: Vector3.Subtract(aabb.position, half),
    max: Vector3.Add(aabb.position, half),
  };
}

// @todo - There likely needs to be a better way of caching the calculated values
// The current API design is because of the desire to allow the position and size
// to follow the IAABB interface so they can be used interchangeably, ie, someone
// can create their own implementation that adheres to the interface and use that
// with other parts of the library.
//
// The downside is that because of this, we cannot know if position or size has
// had some change, therefore we need to calculate it on the fly. In most cases,
// these should not take much time but it can very easily add up.
//
// Some options:
// 1. Implement a `dirty` flag on `Vector3` with a `markClean()` function.
//    + Allows us to track when there have been changes, and re-cache when needed.
//    - Requires Vector3 to add hidden invocations (getters/setters) for components.
//      (not terrible but not good for perf or clarity).
// 2. Remove the IAABB interface dependency in favor of one that enforces caching.
//    + Allows us to cache the calculations
//    - Less portability
// 3. Provide `position` and `size` using getters + a proxy?
//    + Allows us to cache calculations better
//    - More complexity, less clarity
//    - If using a proxy, I doubt that would be good for performance

/**
 * Implementation of an Axis-aligned bounding box. Implements IAABB interface
 * for compat and portability.
 *
 * By default a 3D AABB implementation, however can be switched to a 2D version
 * by making the `z` component of the `size` vector `0`.
 *
 * @example
 * ```
 * // 3D AABB
 * const aabb3d = new AABB(
 *  new Vector3(0, 0, 0),
 *  new Vector3(10, 10, 10),
 * );
 *
 * // 2D AABB
 * const aabb2d = new AABB(
 *  new Vector3(0, 0, 0),
 *  new Vector3(10, 10, 0),
 * );
 * ```
 */
export class AABB implements IAABB {
  public readonly position: Vector3;
  public readonly size: Vector3;

  constructor(position: IVec3, size: IVec3) {
    this.position = new Vector3(position);
    this.size = new Vector3(size);
  }

  public getHalf(): Vector3 {
    return this.size.copy().divideScalar(2);
  }

  public getExtents(): IAABBExtents {
    return calculateExtentsAABB(this);
  }

  public containsPoint(point: Vector3): boolean {
    const { min, max } = calculateExtentsAABB(this);

    // 2D Mode
    if (this.size.z === 0) {
      return point.x >= min.x && point.x <= max.x && point.y >= min.y && point.y <= max.y;
    }

    return (
      point.x >= min.x &&
      point.x <= max.x &&
      point.y >= min.y &&
      point.y <= max.y &&
      point.z >= min.z &&
      point.z <= max.z
    );
  }

  // @todo - SHOULDNT THIS HAVE ORS??????
  public intersectsAABB(other: IAABB): boolean {
    const a = calculateExtentsAABB(this);
    const b = calculateExtentsAABB(other);

    const thisLeft = a.min.x;
    const thisRight = a.max.x;
    const thisTop = a.max.y;
    const thisBottom = a.min.y;

    const otherLeft = b.min.x;
    const otherRight = b.max.x;
    const otherTop = b.max.y;
    const otherBottom = b.min.y;

    const intersects2D =
      thisLeft <= otherRight &&
      thisRight >= otherLeft &&
      thisBottom <= otherTop &&
      thisTop >= otherBottom;

    // 2D handling
    if (this.size.z === 0) {
      return intersects2D;
    }

    const thisForward = a.max.z;
    const thisBackward = a.min.z;
    const otherForward = b.max.z;
    const otherBackward = b.min.z;

    return intersects2D && thisForward >= otherBackward && thisBackward <= otherForward;
  }
}
