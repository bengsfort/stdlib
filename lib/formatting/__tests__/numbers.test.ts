import { describe, it, expect } from 'vitest';

import { restrictDecimals, formatDuration } from '../numbers.js';

describe('formatting/numbers', () => {
  describe('restrictDecimals()', () => {
    it('should limit large floats to a specified number of places', () => {
      // We are intentionally trying to test that it restricts the float properly,
      // therefore the float warning rule is ignorable.

      const randomFloat = 1.5233219472835921359;
      expect(restrictDecimals(randomFloat, 2)).toEqual(1.52);
      expect(restrictDecimals(randomFloat, 1)).toEqual(1.5);
      expect(restrictDecimals(randomFloat, 0)).toEqual(1);
    });

    it('should remove trailing zeroes', () => {
      const randomFloat = 3.040203;
      expect(restrictDecimals(randomFloat, 4)).toEqual(3.0402);
      expect(restrictDecimals(randomFloat, 3)).toEqual(3.04);
      expect(restrictDecimals(randomFloat, 1)).toEqual(3);
    });
  });

  describe('formatDuration()', () => {
    it('should display the value in the most appropriate timescale', () => {
      const microSecs = 0.095;
      expect(formatDuration(microSecs)).toEqual('95μs');

      const millisecs = 50;
      expect(formatDuration(millisecs)).toEqual('50ms');

      const seconds = 3000;
      expect(formatDuration(seconds)).toEqual('3s');

      const minutes = 65000;
      expect(formatDuration(minutes)).toEqual('1m 5s');
    });
  });
});
