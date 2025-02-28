import { clamp, lerp } from './utils.js';

export interface IVec3 {
  x: number;
  y: number;
  z: number;
}

type CtorArgs = [ref: IVec3] | [x?: number, y?: number, z?: number];

export class Vector3 implements IVec3 {
  public x = 0;
  public y = 0;
  public z = 0;

  constructor(...args: CtorArgs) {
    const [first, second, third] = args;
    if (Vector3.IsVec3Like(first)) {
      this.x = first.x;
      this.y = first.y;
      this.z = first.z;
    } else {
      this.x = first ?? 0;
      this.y = second ?? 0;
      this.z = third ?? 0;
    }
  }

  // Helpers
  public static Forward(): Vector3 {
    return new Vector3(0, 0, 1);
  }

  public static Backwards(): Vector3 {
    return new Vector3(0, 0, -1);
  }

  public static Down(): Vector3 {
    return new Vector3(0, -1, 0);
  }

  public static Up(): Vector3 {
    return new Vector3(0, 1, 0);
  }

  public static Left(): Vector3 {
    return new Vector3(-1, 0, 0);
  }

  public static Right(): Vector3 {
    return new Vector3(1, 0, 0);
  }

  public static One(): Vector3 {
    return new Vector3(1, 1, 1);
  }

  public static Zero(): Vector3 {
    return new Vector3(0, 0, 0);
  }

  // Static Helpers
  /**
   * Create a new Vector3 that is the sum of the given Vector3's.
   * @param v1 First Vector3.
   * @param v2 Second Vector3.
   * @returns A new vector of the sum of the given vectors.
   */
  public static Add(v1: IVec3, v2: IVec3): Vector3 {
    return new Vector3(v1.x + v2.x, v1.y + v2.y, v1.z + v2.z);
  }

  /**
   * Create a new Vector3 that is the difference of the given Vector3's.
   * @param v1 First Vector3.
   * @param v2 Second Vector3.
   * @returns A new vector of the difference of the given vectors.
   */
  public static Subtract(v1: IVec3, v2: IVec3): Vector3 {
    return new Vector3(v1.x - v2.x, v1.y - v2.y, v1.z - v2.z);
  }

  /**
   * Create a new Vector3 by multiplying to given vectors.
   * @param v1 First Vector3.
   * @param v2 Second Vector3.
   * @returns A new vector with the result of the given vectors.
   */
  public static Multiply(v1: IVec3, v2: IVec3): Vector3 {
    return new Vector3(v1.x * v2.x, v1.y * v2.y, v1.z * v2.z);
  }

  /**
   * Create a new Vector3 by multiplying the components of a vector by a given value.
   * @param v1 First Vector3.
   * @param val The value to multiply each component by.
   * @returns A new vector with the result.
   */
  public static MultiplyScalar(v1: IVec3, val: number): Vector3 {
    return new Vector3(v1).multiplyScalar(val);
  }

  /**
   * Create a new Vector3 by dividing two vectors.
   * @param v1 First Vector3.
   * @param v2 Second Vector3.
   * @returns A new vector of the result of the given vectors.
   */
  public static Divide(v1: IVec3, v2: IVec3): Vector3 {
    return new Vector3(v1.x / v2.x, v1.y / v2.y, v1.z / v2.z);
  }

  /**
   * Returns whether two vector values are equal.
   * @param v1 First Vector3.
   * @param v2 Second Vector3.
   * @returns Whether the vectors are equal.
   */
  public static Equals(v1: IVec3, v2: IVec3): boolean {
    return v1.x === v2.x && v1.y === v2.y;
  }

  /**
   * Create a new Vector3 by interpolating between two given vectors.
   * @param v1 Start vector.
   * @param v2 Target vector.
   * @param t The amount to interpolate (0 being start, 1 being end, etc.)
   * @returns A new Vector3 with the result.
   */
  public static Lerp(v1: IVec3, v2: IVec3, t: number): Vector3 {
    return new Vector3(lerp(v1.x, v2.x, t), lerp(v1.y, v2.y, t), lerp(v1.z, v2.z, t));
  }

  /**
   * Create a new Vector3 by normalizing a vector (dividing by its length, or 1)
   * @param vector The vector to normalize.
   * @returns A new Vector3 of the normalized vector.
   */
  public static Normalize(vector: IVec3): Vector3 {
    return new Vector3(vector.x, vector.y, vector.z).normalize();
  }

  /**
   * Asserts a given unknonwn value is Vector3-like.
   * @param obj The value.
   * @returns True if it is vec3-like.
   */
  public static IsVec3Like(obj: unknown): obj is IVec3 {
    return (
      typeof obj === 'object' &&
      obj !== null &&
      Object.hasOwn(obj, 'x') &&
      Object.hasOwn(obj, 'y') &&
      Object.hasOwn(obj, 'z')
    );
  }

  /**
   * Get the magnitude of the vector (x^2 + y^2).
   * @returns The magnitude of the vector.
   */
  public getMagnitude(): number {
    const { x, y, z } = this;
    return x * x + y * y + z * z;
  }

  /**
   * Get the length of the vector (square root of magnitude)
   * @returns The length of the vector.
   */
  public getLength(): number {
    return Math.sqrt(this.getMagnitude());
  }

  /**
   * Create a copy of this Vector3.
   * @returns A new instance of Vector3 with this vectors components.
   */
  public copy(): Vector3 {
    return new Vector3(this.x, this.y, this.z);
  }

  /**
   * Add another vector to this vector.
   * @param other The other vector.
   * @returns Itself.
   */
  public add(other: IVec3): this {
    this.x += other.x;
    this.y += other.y;
    this.z += other.z;
    return this;
  }

  /**
   * Multiply this vector by another vector.
   * @param other The other vector.
   * @returns Itself.
   */
  public multiply(other: IVec3): this {
    this.x *= other.x;
    this.y *= other.y;
    this.z *= other.z;
    return this;
  }

  /**
   * Multiply this vector by a single value.
   * @param val The amount to multiply by.
   * @returns Itself.
   */
  public multiplyScalar(val: number): this {
    this.x *= val;
    this.y *= val;
    this.z *= val;
    return this;
  }

  /**
   * Divide this vector by a single value.
   * @param val The amount to divide by.
   * @returns Itself.
   */
  public divideScalar(val: number): this {
    this.x /= val;
    this.y /= val;
    this.z /= val;
    return this;
  }

  /**
   * Multiply this vector by another vector.
   * @param other The other vector.
   * @returns Itself.
   */
  public divide(other: IVec3): this {
    this.x /= other.x;
    this.y /= other.y;
    this.z /= other.z;
    return this;
  }

  /**
   * Set the components of this vector.
   * @param x The x component.
   * @param y The y component.
   * @param z The z component.
   * @returns Itself.
   */
  public set(x: number, y: number, z: number): this {
    this.x = x;
    this.y = y;
    this.z = z;
    return this;
  }

  /**
   * Normalize this vector. Will reduce its length to a max of 1.
   * @returns Itself.
   */
  public normalize(): this {
    return this.divideScalar(this.getLength() || 1);
  }

  /**
   * Interpolating this vector to a target vector.
   * @param target Target vector.
   * @param t The amount to interpolate (0 being itself, 1 being target, etc.)
   * @returns Itself.
   */
  public lerp(target: IVec3, t: number): this {
    this.x = lerp(this.x, target.x, t);
    this.y = lerp(this.y, target.y, t);
    this.z = lerp(this.z, target.z, t);
    return this;
  }

  /**
   * Clamp the components of this vector to a min and max value for each component.
   * @param xMin The minimum value for x.
   * @param xMax The maximum value for x.
   * @param yMin The minimum value for y.
   * @param yMax The maximum value for y.
   * @param zMin The minimum value for z.
   * @param zMax The maximum value for z.
   * @returns Itself.
   */
  public clamp(
    xMin: number,
    xMax: number,
    yMin: number,
    yMax: number,
    zMin: number,
    zMax: number,
  ): this {
    this.clampX(xMin, xMax);
    this.clampY(yMin, yMax);
    this.clampZ(zMin, zMax);
    return this;
  }

  /**
   * Clamp the x component of this vector to a min and max value.
   * @param min The minimum value for x.
   * @param max The maximum value for x.
   * @returns Itself.
   */
  public clampX(min: number, max: number): this {
    this.x = clamp(this.x, min, max);
    return this;
  }

  /**
   * Clamp the y component of this vector to a min and max value.
   * @param min The minimum value for y.
   * @param max The maximum value for y.
   * @returns Itself.
   */
  public clampY(min: number, max: number): this {
    this.y = clamp(this.y, min, max);
    return this;
  }

  /**
   * Clamp the z component of this vector to a min and max value.
   * @param min The minimum value for z.
   * @param max The maximum value for z.
   * @returns Itself.
   */
  public clampZ(min: number, max: number): this {
    this.z = clamp(this.z, min, max);
    return this;
  }

  /**
   * Check equality between this vectors components and a given vectors components.
   * @param val The vector to check equality.
   * @returns If the vectors are equal.
   */
  public equals(val: IVec3): boolean {
    return val.x === this.x && val.y === this.y && val.z === this.z;
  }

  /**
   * Return a lightweight object literal with the x and y component.
   * @returns An object literal with the vector set to x, y.
   */
  public toLiteral(): IVec3 {
    return { x: this.x, y: this.y, z: this.z };
  }

  public toString(): string {
    return `Vector3 (${this.x.toString(10)}, ${this.y.toString(10)}, ${this.z.toString(10)})`;
  }
}
