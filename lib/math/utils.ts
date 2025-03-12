export const EPSILON = 0.000001;

/**
 * Clamps a number between two boundaries.
 *
 * @param value The Value to clamp.
 * @param min The minimum boundary.
 * @param max The maximum boundary.
 * @returns The value clamped between the two boundaries.
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/**
 * Transforms a value from one range to another.
 *
 * @param value The value to interpolate.
 * @param min1 The minimum value for the first range.
 * @param max1 The maximum value for the first range.
 * @param min2 The minimum value for the second range.
 * @param max2 The maximum value for the second range.
 * @returns The interpolated value.
 */
export function transformRange(
  value: number,
  min1: number,
  max1: number,
  min2 = 0,
  max2 = 1,
): number {
  const leftHand = (value - min1) * (max2 - min2);
  const rightHand = max1 - min1;
  if (rightHand === 0) {
    return leftHand + min2;
  }

  return leftHand / rightHand + min2;
}

/**
 * Interpolates a value between the start and end values.
 *
 * @param start The lower boundary or initial value.
 * @param target The target value.
 * @param t the current lerp time.
 * @returns The lerped value.
 */
export function lerp(start: number, target: number, t: number): number {
  return start + (target - start) * t;
}

/**
 * Interpolates a value between the start and end values, clamping the result
 * to prevent extrapolation.
 *
 * @param start The lower boundary or initial value.
 * @param target The target value.
 * @param t the current lerp time.
 * @returns The lerped value.
 */
export function lerpClamped(start: number, target: number, t: number): number {
  return clamp(lerp(start, target, t), start, target);
}
