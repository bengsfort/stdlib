import { describe, it, expect } from 'vitest';

import { Vector3 } from '../vector3.js';

describe('math/vector3', () => {
  it('should store 3d vectors', () => {
    const vec3 = new Vector3(5, 10, 1);
    expect(vec3).toBeInstanceOf(Vector3);
    expect(vec3.x).toEqual(5);
    expect(vec3.y).toEqual(10);
    expect(vec3.z).toEqual(1);
  });

  it('should copy itself to a new vector3', () => {
    const original = new Vector3(327.5, 21, 31);
    const copy = original.copy();
    expect(copy.x).toEqual(original.x);
    expect(copy.y).toEqual(original.y);
    expect(copy.z).toEqual(original.z);
  });

  describe('builtins', () => {
    it('.add should add its values with the given vector', () => {
      const vec = new Vector3(0, 0, 0);

      vec.add(new Vector3(10, 5, 1));
      expect(vec.x).toEqual(10);
      expect(vec.y).toEqual(5);
      expect(vec.z).toEqual(1);

      vec.add({ x: 1, y: 1, z: 1 });
      expect(vec.x).toEqual(11);
      expect(vec.y).toEqual(6);
      expect(vec.z).toEqual(2);
    });

    it('should expose the magnitude of the vector', () => {
      expect(new Vector3(10, 10, 10).getMagnitude()).toEqual(300);
      expect(new Vector3(0, 0, 0).getMagnitude()).toEqual(0);
      expect(new Vector3(5, 10, 5).getMagnitude()).toEqual(150);
      expect(new Vector3(10, 5, 5).getMagnitude()).toEqual(150);
    });

    it('should provide the length of the vector', () => {
      expect(new Vector3(0, 0, 0).getLength()).toEqual(0);
      expect(new Vector3(3, 4, 0).getLength()).toEqual(5);
      expect(new Vector3(1, 2, 2).getLength()).toEqual(3);
      expect(new Vector3(-4, -4, -7).getLength()).toEqual(9);
    });

    it('.multiply should multiply its values with the given vector3', () => {
      const vec = new Vector3(1, 0, 1);

      vec.multiply({ x: 5, y: 10, z: 10 });
      expect(vec.x).toEqual(5);
      expect(vec.y).toEqual(0);
      expect(vec.z).toEqual(10);
    });

    it('.multiplyScalar should multiply its values with the given number', () => {
      const vec = new Vector3(0, 1, 1);

      vec.multiplyScalar(5);
      expect(vec.x).toEqual(0);
      expect(vec.y).toEqual(5);
      expect(vec.z).toEqual(5);
    });

    it('.divideScalar should divide its values with the given number', () => {
      const vec = new Vector3(10, 10, 10);
      vec.divideScalar(5);
      expect(vec.x).toEqual(2);
      expect(vec.y).toEqual(2);
      expect(vec.z).toEqual(2);

      vec.divideScalar(0);
      expect(vec.x).toEqual(Infinity);
      expect(vec.y).toEqual(Infinity);
      expect(vec.z).toEqual(Infinity);
    });

    it('.divide should divide its values with the given vector3', () => {
      const vec = new Vector3(10, 10, 10);
      vec.divide({ x: 2, y: 5, z: 10 });
      expect(vec.x).toEqual(5);
      expect(vec.y).toEqual(2);
      expect(vec.z).toEqual(1);
    });

    it('.equals should check value equality with the given vector', () => {
      const original = new Vector3(100, 200, 300);
      const notEqual = new Vector3(500, 420, 300);
      const equal = new Vector3(100, 200, 300);

      expect(original.equals(notEqual)).toEqual(false);
      expect(original.equals(equal)).toEqual(true);
    });

    it('should lerp to a new vector', () => {
      const original = new Vector3(0, 0, 0);
      const target = new Vector3(100, 100, 100);

      original.lerp(target, 0.5);
      expect(original.x).toEqual(50);
      expect(original.y).toEqual(50);
      expect(original.z).toEqual(50);
    });
  });

  describe('static helpers', () => {
    it('Vector3.Add should return a new vector with the sum of the given vectors', () => {
      const v1 = new Vector3(5, 5, 5);
      const v2 = new Vector3(10, 20, 30);
      const result = Vector3.Add(v1, v2);

      expect(result.x).toEqual(15);
      expect(result.y).toEqual(25);
      expect(result.z).toEqual(35);
    });

    it('Vector3.Subtract should return a new vector with the difference of the given vectors', () => {
      const v1 = new Vector3(5, 5, 5);
      const v2 = new Vector3(10, 20, 30);
      const result = Vector3.Subtract(v1, v2);

      expect(result.x).toEqual(-5);
      expect(result.y).toEqual(-15);
      expect(result.z).toEqual(-25);
    });

    it('Vector3.Multiply should return a new vector with the product of the given vectors', () => {
      const v1 = new Vector3(5, 5, 5);
      const v2 = new Vector3(10, 20, 30);
      const result = Vector3.Multiply(v1, v2);

      expect(result.x).toEqual(50);
      expect(result.y).toEqual(100);
      expect(result.z).toEqual(150);
    });

    it('Vector3.Divide should return a new vector with the quotient of the given vectors', () => {
      const v1 = new Vector3(5, 5, 10);
      const v2 = new Vector3(10, 20, 20);
      const result = Vector3.Divide(v1, v2);

      expect(result.x).toEqual(0.5);
      expect(result.y).toEqual(0.25);
      expect(result.z).toEqual(0.5);
    });

    it('Vector3.Equals should check whether two vectors are equal', () => {
      const v1 = new Vector3(5, 2, 5);
      const v2 = new Vector3(10, 5, 5);
      const v3 = new Vector3(5, 2, 5);

      expect(Vector3.Equals(v1, v2)).toEqual(false);
      expect(Vector3.Equals(v1, v3)).toEqual(true);
    });

    it('Should provide a helper to lerp between two vectors', () => {
      const v1 = new Vector3(5, 5, 5);
      const v2 = new Vector3(10, 10, 10);
      const result = Vector3.Lerp(v1, v2, 0.5);

      expect(result.x).toEqual(7.5);
      expect(result.y).toEqual(7.5);
      expect(result.z).toEqual(7.5);
    });

    it('Should normalize a vector', () => {
      const v1 = new Vector3(5, 5, 5);
      expect(Vector3.Normalize(v1).getLength()).toBeCloseTo(1);

      const v2 = new Vector3(10, 5, 5);
      expect(Vector3.Normalize(v2).getLength()).toBeCloseTo(1);
    });
  });
});
