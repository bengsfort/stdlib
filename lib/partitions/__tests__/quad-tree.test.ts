import { describe, it, expect } from 'vitest';

describe('partitions/quad-tree', () => {
  describe('core functionality', () => {
    it('should accept items that are within the trees bounds', () => {
      expect('@todo').toEqual(true);
    });

    it('should remove items within the tree', () => {
      expect('@todo').toEqual(true);
    });

    it('should not merge overlapping items', () => {
      expect('@todo').toEqual(true);
    });

    it('should subdivide the tree once it reaches capacity', () => {
      // @todo: Make sure the tree re-distributes everything
      expect('@todo').toEqual(true);
    });

    it('should store items that span multiple boundaries in the highest common node', () => {
      expect('@todo').toEqual(true);
    });

    it('should reset and empty the tree', () => {
      expect('@todo').toEqual(true);
    });

    it('should not subdivide if there is no more space to', () => {
      // ie: if we have reached max subdivision, don't try again
      // (cant have a quad that is 0.5 wide or something)
      expect('@todo').toEqual(true);
    });
  });

  describe('querying', () => {
    it('should retrieve points within a given rectangular range', () => {
      expect('@todo').toEqual(true);
    });

    it('should retrieve points within a given circular range', () => {
      expect('@todo').toEqual(true);
    });

    it('should handle large queries', () => {
      expect('@todo').toEqual(true);
    });

    // @todo: performance test?
  });
});
