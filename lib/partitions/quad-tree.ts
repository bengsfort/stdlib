interface Point {
  x: number;
  y: number;
}

interface Bounds {
  position: Point;
  includesPoint(point: Point): boolean;
  intersects(other: Bounds): boolean;
}

interface RectBounds extends Bounds {
  half: number;
}

type QueryResultTuple = [id: string, point: Point];

export class QuadTree {
  public readonly capacity: number;
  public readonly bounds: RectBounds;

  #_items: Map<string, Bounds>;
  #_nw?: QuadTree;
  #_ne?: QuadTree;
  #_sw?: QuadTree;
  #_se?: QuadTree;

  constructor(bounds: RectBounds, capacity: number) {
    this.bounds = bounds;
    this.capacity = capacity;
    this.#_items = new Map();
  }

  public insert(id: string, item: Bounds): boolean {
    // Ignore objects that don't belong in this partition
    if (!this.bounds.intersects(item)) {
      return false;
    }

    // If we haven't subdivided yet, and have capacity, insert here
    if (this.#_items.size < this.capacity && !this.#_nw) {
      this.#_items.set(id, item);
      return true;
    }

    // At this point we are over capacity. Subdivide if we haven't yet.
    if (!this.#_nw) {
      this.subdivide();
    }

    // Add the item to whichever partition accepts it
    if (this.#_nw?.insert(id, item)) return true;
    if (this.#_ne?.insert(id, item)) return true;
    if (this.#_sw?.insert(id, item)) return true;
    if (this.#_se?.insert(id, item)) return true;

    // Something went terribly wrong and the point could not be inserted.
    // This SHOULD never happen, but could in theory happen if every partition
    // downstream is full and can no longer be subdivided.
    return false;
  }

  public remove(id: string): boolean {
    // If this node has the item, just deleted it and return.
    if (this.#_items.has(id)) {
      return this.#_items.delete(id);
    }

    // If we haven't subdivided yet, there is nothing else to do so return.
    if (!this.#_nw) {
      return false;
    }

    // Try to remove it from any downstream nodes
    if (this.#_nw.remove(id)) return true;
    if (this.#_ne?.remove(id)) return true;
    if (this.#_sw?.remove(id)) return true;
    if (this.#_se?.remove(id)) return true;

    // The point could not be found anywhere in this tree.
    return false;
  }

  public subdivide(): boolean {
    const { position, half } = this.bounds;

    return false;
  }

  public queryRange(range: Bounds, results: QueryResultTuple[] = []): QueryResultTuple[] {
    // @todo
    return results;
  }

  public clear(): void {
    this.#_items.clear();

    this.#_nw?.clear();
    this.#_nw = undefined;

    this.#_ne?.clear();
    this.#_ne = undefined;

    this.#_sw?.clear();
    this.#_sw = undefined;

    this.#_se?.clear();
    this.#_se = undefined;
  }
}
