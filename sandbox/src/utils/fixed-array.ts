export class RepeatingArray<T> {
  #_data: T[];
  #_size: number;
  #_cursor: number;
  #_count: number;

  constructor(size: number) {
    this.#_data = new Array<T>(size);
    this.#_size = size;
    this.#_cursor = 0;
    this.#_count = 0;
  }

  public add(item: T): void {
    this.#_data[this.#_cursor] = item;

    this.#_count = Math.min(this.#_count + 1, this.#_size);
    this.#_cursor += 1;
    if (this.#_cursor >= this.#_size) {
      this.#_cursor = 0;
    }
  }

  public getCount(): number {
    return this.#_count;
  }

  public getSize(): number {
    return this.#_size;
  }

  public [Symbol.iterator](): Iterator<T> {
    let idx = 0;

    return {
      next: (): IteratorResult<T> => {
        if (idx >= this.#_count) return { done: true, value: undefined };

        return {
          value: this.#_data[idx++],
          done: false,
        };
      },
    };
  }
}
