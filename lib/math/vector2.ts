import { clamp } from './utils.js';

export interface V2 {
  x: number;
  y: number;
}

export class Vector2 implements V2 {
  public x = 0;
  public y = 0;

  constructor(x = 0, y = 0) {
    this.x = x;
    this.y = y;
  }

  // Helpers
  public static Down(): Vector2 {
    return new Vector2(0, -1);
  }
  public static Up(): Vector2 {
    return new Vector2(0, 1);
  }
  public static Left(): Vector2 {
    return new Vector2(-1, 0);
  }
  public static Right(): Vector2 {
    return new Vector2(1, 0);
  }
  public static One(): Vector2 {
    return new Vector2(1, 1);
  }
  public static Zero(): Vector2 {
    return new Vector2(0, 0);
  }

  // Static Helpers
  /**
   * Create a new Vector2 that is the sum of the given Vector2's.
   * @param v1 First Vector2.
   * @param v2 Second Vector2.
   * @returns A new vector of the sum of the given vectors.
   */
  public static Add(v1: Vector2, v2: Vector2): Vector2 {
    return new Vector2(v1.x + v2.x, v1.y + v2.y);
  }

  /**
   * Create a new Vector2 that is the difference of the given Vector2's.
   * @param v1 First Vector2.
   * @param v2 Second Vector2.
   * @returns A new vector of the difference of the given vectors.
   */
  public static Subtract(v1: Vector2, v2: Vector2): Vector2 {
    return new Vector2(v1.x - v2.x, v1.y - v2.y);
  }

  /**
   * Create a new Vector2 by multiplying to given vectors.
   * @param v1 First Vector2.
   * @param v2 Second Vector2.
   * @returns A new vector with the result of the given vectors.
   */
  public static Multiply(v1: Vector2, v2: Vector2): Vector2 {
    return new Vector2(v1.x * v2.x, v1.y * v2.y);
  }

  /**
   * Create a new Vector2 by multiplying the components of a vector by a given value.
   * @param v1 First Vector2.
   * @param val The value to multiply each component by.
   * @returns A new vector with the result.
   */
  public static MultiplyScalar(v1: Vector2, val: number): Vector2 {
    return v1.copy().multiplyScalar(val);
  }

  /**
   * Create a new Vector2 by dividing two vectors.
   * @param v1 First Vector2.
   * @param v2 Second Vector2.
   * @returns A new vector of the result of the given vectors.
   */
  public static Divide(v1: Vector2, v2: Vector2): Vector2 {
    return new Vector2(v1.x / v2.x, v1.y / v2.y);
  }

  /**
   * Returns whether two vector values are equal.
   * @param v1 First Vector2.
   * @param v2 Second Vector2.
   * @returns Whether the vectors are equal.
   */
  public static Equals(v1: V2, v2: V2): boolean {
    return v1.x === v2.x && v1.y === v2.y;
  }

  /**
   * Create a new Vector2 by interpolating between two given vectors.
   * @param v1 Start vector.
   * @param v2 Target vector.
   * @param t The amount to interpolate (0 being start, 1 being end, etc.)
   * @returns A new Vector2 with the result.
   */
  public static Lerp(v1: V2, v2: V2, t: number): Vector2 {
    return new Vector2(v1.x + (v2.x - v1.x) * t, v1.y + (v2.y - v1.y) * t);
  }

  /**
   * Create a new Vector2 by normalizing a vector (dividing by its length, or 1)
   * @param vector The vector to normalize.
   * @returns A new Vector2 of the normalized vector.
   */
  public static Normalize(vector: V2): Vector2 {
    return new Vector2(vector.x, vector.y).normalize();
  }

  /**
   * Get the magnitude of the vector (x^2 + y^2).
   * @returns The magnitude of the vector.
   */
  public getMagnitude(): number {
    const { x, y } = this;
    return x * x + y * y;
  }

  /**
   * Get the length of the vector (square root of magnitude)
   * @returns The length of the vector.
   */
  public getLength(): number {
    return Math.sqrt(this.getMagnitude());
  }

  /**
   * Create a copy of this Vector2.
   * @returns A new instance of Vector2 with this vectors components.
   */
  public copy(): Vector2 {
    return new Vector2(this.x, this.y);
  }

  /**
   * Add another vector to this vector.
   * @param other The other vector.
   * @returns Itself.
   */
  public add(other: V2): this {
    this.x += other.x;
    this.y += other.y;
    return this;
  }

  /**
   * Multiply this vector by another vector.
   * @param other The other vector.
   * @returns Itself.
   */
  public multiply(other: V2): this {
    this.x *= other.x;
    this.y *= other.y;
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
    return this;
  }

  /**
   * Multiply this vector by another vector.
   * @param other The other vector.
   * @returns Itself.
   */
  public divide(other: V2): this {
    this.x /= other.x;
    this.y /= other.y;
    return this;
  }

  /**
   * Set the components of this vector.
   * @param x The x component.
   * @paramy The y component.
   * @returns Itself.
   */
  public set(x: number, y: number): this {
    this.x = x;
    this.y = y;
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
  public lerp(target: V2, t: number): this {
    this.x += (target.x - this.x) * t;
    this.y += (target.y - this.y) * t;
    return this;
  }

  /**
   * Clamp the components of this vector to a min and max value for each component.
   * @param xMin The minimum value for x.
   * @param xMax The maximum value for x.
   * @param yMin The minimum value for y.
   * @param yMax The maximum value for y.
   * @returns Itself.
   */
  public clamp(xMin: number, xMax: number, yMin: number, yMax: number): this {
    this.clampX(xMin, xMax);
    this.clampY(yMin, yMax);
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
   * Check equality between this vectors components and a given vectors components.
   * @param val The vector to check equality.
   * @returns If the vectors are equal.
   */
  public equals(val: V2): boolean {
    return val.x === this.x && val.y === this.y;
  }

  /**
   * Return a lightweight object literal with the x and y component.
   * @returns An object literal with the vector set to x, y.
   */
  public toLiteral(): V2 {
    return { x: this.x, y: this.y };
  }

  public toString(): string {
    return `Vector2 (${this.x.toString(10)}, ${this.y.toString(10)})`;
  }
}
