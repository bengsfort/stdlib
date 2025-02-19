/**
 * An ease-in easing function.
 *
 * @param t Current timestep.
 * @returns t with easing applied.
 * @see https://chicounity3d.wordpress.com/2014/05/23/how-to-lerp-like-a-pro/
 */
export function easeIn(t: number): number {
  return 1.0 - Math.cos(t * Math.PI * 0.5);
}

/**
 * An ease-out easing function.
 *
 * @param t Current timestep.
 * @returns t with easing applied.
 * @see https://chicounity3d.wordpress.com/2014/05/23/how-to-lerp-like-a-pro/
 */
export function easeOut(t: number): number {
  return Math.sin(t * Math.PI * 0.5);
}

/**
 * An exponential easing function.
 *
 * @param t Current timestep.
 * @returns t with easing applied.
 * @see https://chicounity3d.wordpress.com/2014/05/23/how-to-lerp-like-a-pro/
 */
export function exponential(t: number): number {
  return t * t;
}

/**
 * A smoothstep easing function.
 *
 * @param t Current timestep.
 * @returns t with easing applied.
 * @see https://chicounity3d.wordpress.com/2014/05/23/how-to-lerp-like-a-pro/
 */
export function smoothstep(t: number): number {
  return t * t * (3.0 - 2.0 * t);
}

/**
 * A smootherstep easing function.
 *
 * @param t Current timestep.
 * @returns t with easing applied.
 * @see https://chicounity3d.wordpress.com/2014/05/23/how-to-lerp-like-a-pro/
 */
export function smootherstep(t: number): number {
  return t * t * t * (t * (6.0 * t - 15.0) + 10.0);
}
