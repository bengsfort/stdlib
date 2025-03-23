import { transformRange } from '@stdlib/math/utils';
import { Vector2 } from '@stdlib/math/vector2';

import { SandboxContext } from '../context';
import { IDrawableAABB } from '../drawables/aabb';
import { Drawable } from '../drawables/drawable';

import { Scene, SceneFactory } from './scene';

const MODIFIER = 0.0016;

class ShapeScene implements Scene {
  #_ctx: SandboxContext;
  #_drawables: Drawable[];
  #_boxIndex = 1;

  constructor(context: SandboxContext) {
    this.#_ctx = context;
    this.#_drawables = [
      {
        drawType: 'grid',
        range: new Vector2(20, 20),
        color: '#989898',
        gridColor: '#383838',
      },
      {
        drawType: 'aabb',
        fill: 'transparent',
        stroke: 'red',
        aabb: {
          min: new Vector2(-4, -4),
          max: new Vector2(4, 4),
        },
      },
      {
        drawType: 'circle',
        fill: 'transparent',
        stroke: 'red',
        circle: {
          radius: 2,
          position: new Vector2(6, 0),
        },
      },
      {
        drawType: 'point',
        position: new Vector2(6, 6),
        color: 'red',
      },
      {
        drawType: 'ray',
        ray: {
          position: new Vector2(-6, -6),
          direction: new Vector2(1, 1),
        },
        color: 'red',
      },
    ];
  }

  public tick(now: number): void {
    const box = this.#_drawables[this.#_boxIndex] as IDrawableAABB;
    const sin = Math.sin(now * MODIFIER);

    box.aabb.min.x = transformRange(sin, -1, 1, -4, -2);
    box.aabb.min.y = transformRange(sin, -1, 1, -4, -2);
    box.aabb.max.x = transformRange(-sin, -1, 1, 2, 4);
    box.aabb.max.y = transformRange(-sin, -1, 1, 2, 4);

    this.#_ctx.renderer.render(this.#_drawables);
  }

  public cleanup(): void {
    // @todo
    this.#_drawables = [];
  }
}

export const createScene: SceneFactory = (context: SandboxContext): Scene => {
  return new ShapeScene(context);
};
