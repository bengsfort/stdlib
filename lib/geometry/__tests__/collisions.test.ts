import { describe, it, expect } from 'vitest';

import { Vector2 } from '../../math/vector2.js';
import { Vector3 } from '../../math/vector3.js';
import { aabbContainsPoint2D, aabbContainsPoint3D } from '../collisions.js';
import type { IAABB } from '../primitives.js';

describe('geometry/collisions', () => {
  describe('aabbContainsPoint2D', () => {
    it('should return if a 2d point is contained by an AABB', () => {
      const bounds: IAABB = {
        size: new Vector3(10, 10),
        position: new Vector3(0, 0),
      };

      // Check extents
      expect(aabbContainsPoint2D(bounds, new Vector2(5, 5))).toEqual(true);
      expect(aabbContainsPoint2D(bounds, new Vector2(-5, -5))).toEqual(true);
      expect(aabbContainsPoint2D(bounds, new Vector2(-5, 5))).toEqual(true);
      expect(aabbContainsPoint2D(bounds, new Vector2(5, -5))).toEqual(true);

      // Check inside
      expect(aabbContainsPoint2D(bounds, new Vector2(2, 0))).toEqual(true);

      // Make sure it is false outside
      expect(aabbContainsPoint2D(bounds, new Vector2(10, 10))).toEqual(false);
      expect(aabbContainsPoint2D(bounds, new Vector2(10, 0))).toEqual(false);
      expect(aabbContainsPoint2D(bounds, new Vector2(0, 10))).toEqual(false);
    });
  });

  describe('aabbContainsPoint3D', () => {
    it('should return if a 3d point is contained by an AABB', () => {
      const bounds: IAABB = {
        size: new Vector3(10, 10, 10),
        position: new Vector3(0, 0, 0),
      };

      // Check extents
      expect(aabbContainsPoint3D(bounds, new Vector3(5, 5, 5))).toEqual(true);
      expect(aabbContainsPoint3D(bounds, new Vector3(-5, 5, 5))).toEqual(true);
      expect(aabbContainsPoint3D(bounds, new Vector3(5, -5, 5))).toEqual(true);
      expect(aabbContainsPoint3D(bounds, new Vector3(5, 5, -5))).toEqual(true);
      expect(aabbContainsPoint3D(bounds, new Vector3(-5, -5, 5))).toEqual(true);
      expect(aabbContainsPoint3D(bounds, new Vector3(-5, 5, -5))).toEqual(true);
      expect(aabbContainsPoint3D(bounds, new Vector3(5, -5, -5))).toEqual(true);
      expect(aabbContainsPoint3D(bounds, new Vector3(-5, -5, -5))).toEqual(true);

      // Check inside
      expect(aabbContainsPoint3D(bounds, new Vector3(0, 0, 0))).toEqual(true);
      expect(aabbContainsPoint3D(bounds, new Vector3(2, 0, 1))).toEqual(true);

      // Make sure it is false outside
      expect(aabbContainsPoint3D(bounds, new Vector3(10, 10, 10))).toEqual(false);
      expect(aabbContainsPoint3D(bounds, new Vector3(10, 0, 0))).toEqual(false);
      expect(aabbContainsPoint3D(bounds, new Vector3(0, 10, 0))).toEqual(false);
    });
  });
});
