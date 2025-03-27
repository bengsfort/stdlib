import { Vector2 } from '@stdlib/math/vector2.js';

import { SandboxContext } from '../context.js';
import { SceneObject } from '../scenes/scene.js';

export abstract class DrawableObject implements SceneObject {
  public readonly rid: number;
  public readonly position: Vector2;

  #_ctx: SandboxContext;

  constructor(ctx: SandboxContext) {
    this.#_ctx = ctx;
    this.position = Vector2.Zero();

    const compositor = ctx.renderer.getCompositor();
    this.rid = compositor.createResource();
  }

  public destroy(): void {
    const compositor = this.#_ctx.renderer.getCompositor();
    compositor.deleteResource(this.rid);
  }

  public abstract draw(): void;
}
