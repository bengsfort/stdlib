import { describe, it, expect } from 'vitest';

import { Vector2 } from '../../math/vector2.js';
import {
  aabbContainsPoint2D,
  aabbIntersectsAabb2D,
  aabbIntersectsCircle2D,
  circleContainsPoint2D,
  circleIntersectsCircle2D,
} from '../collisions2d.js';
import type { IAABB2D, ICircle } from '../primitives.js';

describe('geometry/collisions', () => {
  describe('aabbContainsPoint2D', () => {
    it('should return if a 2d point is contained by an AABB', () => {
      const bounds: IAABB2D = {
        min: new Vector2(-5, -5),
        max: new Vector2(5, 5),
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

    describe('aabbIntersectsAabb2D', () => {
      it('should return true if two aabb intersect', () => {
        const base: IAABB2D = {
          min: new Vector2(-5, -5),
          max: new Vector2(5, 5),
        };

        // Overlaps slightly on the top-right edge
        expect(
          aabbIntersectsAabb2D(base, {
            min: new Vector2(2.5, 2.5),
            max: new Vector2(7.5, 7.5),
          }),
        ).toEqual(true);

        // Overlaps entirely on bottom
        expect(
          aabbIntersectsAabb2D(base, {
            min: new Vector2(-50, -10),
            max: new Vector2(50, -2.5),
          }),
        ).toEqual(true);

        // Overlaps entirely on side
        expect(
          aabbIntersectsAabb2D(base, {
            min: new Vector2(2.5, -50),
            max: new Vector2(7.5, 50),
          }),
        ).toEqual(true);

        // Pokes in on one side only
        expect(
          aabbIntersectsAabb2D(base, {
            min: new Vector2(2.5, 2),
            max: new Vector2(7.5, 4),
          }),
        ).toEqual(true);
      });

      it('should return false if two aabb do not intersect', () => {
        const base: IAABB2D = {
          min: new Vector2(0, 0),
          max: new Vector2(2, 2),
        };

        // No-where near
        expect(
          aabbIntersectsAabb2D(base, {
            min: new Vector2(100, 100),
            max: new Vector2(200, 200),
          }),
        ).toEqual(false);

        // Close and above
        expect(
          aabbIntersectsAabb2D(base, {
            min: new Vector2(-2, 2.5),
            max: new Vector2(4, 4),
          }),
        ).toEqual(false);

        // Close to the right
        expect(
          aabbIntersectsAabb2D(base, {
            min: new Vector2(2.5, -2),
            max: new Vector2(3, 4),
          }),
        ).toEqual(false);
      });

      it('should return true if an aabb contains another', () => {
        const a: IAABB2D = {
          min: new Vector2(-5, -5),
          max: new Vector2(5, 5),
        };
        const b: IAABB2D = {
          min: new Vector2(-10, -10),
          max: new Vector2(10, 10),
        };

        expect(aabbIntersectsAabb2D(a, b)).toEqual(true);
        expect(aabbIntersectsAabb2D(b, a)).toEqual(true);
      });
    });
  });

  describe('closestPointOnAabb2D', () => {
    it('should return the closest point on the bounds', () => {
      const bounds: IAABB2D = {
        min: new Vector2(-5, -5),
        max: new Vector2(5, 5),
      };
    });

    it('should return the point if it is within the bounds', () => { });
  });

  describe('aabbIntersectsCircle2D', () => {
    it('should return true if a circle and aabb intersect', () => {
      const a: IAABB2D = {
        min: new Vector2(0, 0),
        max: new Vector2(5, 5),
      };

      const overlapping: ICircle = {
        position: new Vector2(6, 6),
        radius: 2,
      };

      const contained: ICircle = {
        position: new Vector2(2.5, 2.5),
        radius: 1,
      };

      expect(aabbIntersectsCircle2D(a, overlapping)).toEqual(true);
      expect(aabbIntersectsCircle2D(a, contained)).toEqual(true);
    });

    it('should return false if a circle and aabb do not intersect', () => {
      const a: IAABB2D = {
        min: new Vector2(0, 0),
        max: new Vector2(5, 5),
      };

      const far: ICircle = {
        position: new Vector2(100, 100),
        radius: 2,
      };

      const close: ICircle = {
        position: new Vector2(6, 6),
        radius: 1,
      };

      expect(aabbIntersectsCircle2D(a, far)).toEqual(false);
      expect(aabbIntersectsCircle2D(a, close)).toEqual(false);
    });
  });

  describe('circleContainsPoint2D', () => {
    it('should detect points within a circle', () => {
      const circle: ICircle = {
        position: new Vector2(0, 0),
        radius: 5,
      };

      // Clear cases
      expect(circleContainsPoint2D(circle, new Vector2(0, 0))).toEqual(true);
      expect(circleContainsPoint2D(circle, new Vector2(4, 2))).toEqual(true);
      expect(circleContainsPoint2D(circle, new Vector2(-4, -4))).toEqual(true);
      expect(circleContainsPoint2D(circle, new Vector2(100, 100))).toEqual(false);

      // Since it is a circle, { radius, radius } should be false.
      expect(
        circleContainsPoint2D(circle, new Vector2(circle.radius, circle.radius)),
      ).toEqual(false);
      expect(
        circleContainsPoint2D(circle, new Vector2(-circle.radius, -circle.radius)),
      ).toEqual(false);
      expect(
        circleContainsPoint2D(circle, new Vector2(circle.radius, -circle.radius)),
      ).toEqual(false);
      expect(
        circleContainsPoint2D(circle, new Vector2(-circle.radius, circle.radius)),
      ).toEqual(false);

      // Straight up and side should be true.
      const top = new Vector2(circle.position.x, circle.position.y + circle.radius);
      const left = new Vector2(circle.position.x - circle.radius, circle.position.y);
      const right = new Vector2(circle.position.x + circle.radius, circle.position.y);
      const bottom = new Vector2(circle.position.x, circle.position.y - circle.radius);
      expect(circleContainsPoint2D(circle, top)).toEqual(true);
      expect(circleContainsPoint2D(circle, left)).toEqual(true);
      expect(circleContainsPoint2D(circle, right)).toEqual(true);
      expect(circleContainsPoint2D(circle, bottom)).toEqual(true);
    });
  });

  describe('circleIntersectsCircle2D', () => {
    it('should detect if two circles intersect', () => {
      const base: ICircle = {
        position: new Vector2(0, 0),
        radius: 5,
      };

      // Intersection cases
      expect(
        circleIntersectsCircle2D(base, {
          position: new Vector2(5, 0),
          radius: 3,
        }),
      ).toEqual(true);
      expect(
        circleIntersectsCircle2D(base, {
          position: new Vector2(0, -5),
          radius: 3,
        }),
      ).toEqual(true);

      // No way jose cases
      expect(
        circleIntersectsCircle2D(base, {
          position: new Vector2(100, 100),
          radius: 5,
        }),
      ).toEqual(false);
      expect(
        circleIntersectsCircle2D(base, {
          position: new Vector2(10, 10),
          radius: 4,
        }),
      ).toEqual(false);
    });
  });
});
