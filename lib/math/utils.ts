/**
 * Clamps a number between two boundaries.
 *
 * @param {number} value The Value to clamp.
 * @param {number} min The minimum boundary.
 * @param {number} max The maximum boundary.
 * @returns {number} The value calmped between the two boundaries.
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/**
 * Transforms a value from one range to another.
 *
 * @param {number} value The value to interpolate.
 * @param {number} min1 The minimum value for the first range.
 * @param {number} max1 The maximum value for the first range.
 * @param {number} min2 The minimum value for the second range.
 * @param {number} max2 The maximum value for the second range.
 * @returns {number} The interpolated value.
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
 * @param {number} start The lower boundary or initial value.
 * @param {number} target The target value.
 * @param {number} t the current lerp time.
 * @returns {number} The lerped value.
 */
export function lerp(start: number, target: number, t: number): number {
  return start + (target - start) * t;
}

/**
 * Interpolates a value between the start and end values, clamping the result
 * to prevent extrapolation.
 *
 * @param {number} start The lower boundary or initial value.
 * @param {number} target The target value.
 * @param {number} t the current lerp time.
 * @returns {number} The lerped value.
 */
export function lerpClamped(start: number, target: number, t: number): number {
  return clamp(lerp(start, target, t), start, target);
}
