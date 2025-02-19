import { describe, expect, it } from 'vitest';

import { getErrorMessage } from '../errors.js';

describe('errors', () => {
  describe('getErrorMessage', () => {
    it('should return the message of an error', () => {
      const message = 'message';
      const error = new Error(message);
      expect(getErrorMessage(error)).toBe(message);
    });

    it('should return the message of an object with a message property', () => {
      const message = 'message';
      const error = { message };
      expect(getErrorMessage(error)).toBe(message);
    });

    it('should return the stringified value of an object without a message property', () => {
      const value = { foo: 'bar' };
      expect(getErrorMessage(value)).toBe(JSON.stringify(value));
    });

    it('should return the same value back if given a non-object', () => {
      const str = 'Foo bar';
      expect(getErrorMessage(str)).toBe(str);

      const num = 42;
      expect(getErrorMessage(num)).toBe(num.toString(10));
    });
  });
});
