export class Measure {
  public readonly id: string;

  #_start: number;
  #_end: number;
  #_duration: number;

  constructor(id: string) {
    this.id = id;
    this.#_start = performance.now();
    this.#_end = -1;
    this.#_duration = -1;
  }

  public getDuration(): number {
    return this.#_duration;
  }

  public finish(): number {
    if (this.#_end === -1) {
      this.#_end = performance.now();
      this.#_duration = this.#_end = this.#_start;
    }

    return this.#_duration;
  }
}
