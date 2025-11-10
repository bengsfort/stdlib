import { describe, expect, it } from 'vitest';

import { Vector3 } from '../../math/vector3.js';
import { aabbContainsPoint3D, aabbIntersectsAabb3D } from '../collisions3d.js';
import { IAABB } from '../primitives.js';

describe('geometry/collisions3d', () => {
  describe('aabbContainsPoint3D', () => {
    it('should return if a 3d point is contained by an AABB', () => {
      const bounds: IAABB = {
        min: new Vector3(-5, -5, -5),
        max: new Vector3(5, 5, 5),
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

  describe('aabbIntersectsAabb3D', () => {
    it('should return true if two aabb intersect', () => {
      const base: IAABB = {
        min: new Vector3(-5, -5, -5),
        max: new Vector3(5, 5, 5),
      };

      // Overlaps slightly on the top-right edge
      expect(
        aabbIntersectsAabb3D(base, {
          min: new Vector3(2.5, 2, 4),
          max: new Vector3(5, 5, 5),
        }),
      ).toEqual(true);

      // Overlaps entirely on bottom
      expect(
        aabbIntersectsAabb3D(base, {
          min: new Vector3(-10, -10, -10),
          max: new Vector3(10, 0, 10),
        }),
      ).toEqual(true);

      // Overlaps entirely on side
      expect(
        aabbIntersectsAabb3D(base, {
          min: new Vector3(0, -10, -10),
          max: new Vector3(10, 10, 10),
        }),
      ).toEqual(true);

      // Pokes in on one side only
      expect(
        aabbIntersectsAabb3D(base, {
          min: new Vector3(1, 2, 2),
          max: new Vector3(10, 4, 4),
        }),
      ).toEqual(true);
    });

    it('should return false if two aabb do not intersect', () => {
      const base: IAABB = {
        min: new Vector3(2, 2, 2),
        max: new Vector3(4, 4, 4),
      };

      // No-where near
      expect(
        aabbIntersectsAabb3D(base, {
          min: new Vector3(100, 100, 100),
          max: new Vector3(110, 110, 110),
        }),
      ).toEqual(false);

      // Close and above
      expect(
        aabbIntersectsAabb3D(base, {
          min: new Vector3(2, 5, 2),
          max: new Vector3(4, 10, 4),
        }),
      ).toEqual(false);

      // Close to the right
      expect(
        aabbIntersectsAabb3D(base, {
          min: new Vector3(5, 2, 2),
          max: new Vector3(10, 4, 4),
        }),
      ).toEqual(false);
    });

    it('should return true if an aabb contains another', () => {
      const a: IAABB = {
        min: new Vector3(-10, -10, -10),
        max: new Vector3(10, 10, 10),
      };
      const b: IAABB = {
        min: new Vector3(-5, -5, -5),
        max: new Vector3(5, 5, 5),
      };

      expect(aabbIntersectsAabb3D(a, b)).toEqual(true);
      expect(aabbIntersectsAabb3D(b, a)).toEqual(true);
    });
  });
});
