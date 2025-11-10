import type { IAABB2D, ICircle, IRay2D } from '@stdlib/geometry/primitives';
import { transformRange } from '@stdlib/math/utils';
import { Vector2 } from '@stdlib/math/vector2';

import { SandboxContext } from '../context';
import { drawAABB } from '../drawables/aabb';
import { drawCircle } from '../drawables/circle';
import { drawGrid } from '../drawables/grid';
import { drawPoint } from '../drawables/point';
import { drawRay } from '../drawables/ray';
import type { RenderSettings } from '../renderer/render-settings';

import type { Scene, SceneFactory } from './scene';

const MODIFIER = 0.0016;

class ShapeScene implements Scene {
  public readonly cameraOrigin: Vector2;

  #_aabb: IAABB2D;
  #_circle: ICircle;
  #_point: Vector2;
  #_ray: IRay2D;

  constructor() {
    this.cameraOrigin = new Vector2(0, 0);

    this.#_aabb = {
      min: new Vector2(-4, -4),
      max: new Vector2(4, 4),
    };

    this.#_circle = {
      radius: 2,
      position: new Vector2(6, 0),
    };

    this.#_point = new Vector2(6, 6);
    this.#_ray = {
      position: new Vector2(-6, -6),
      direction: new Vector2(1, 1),
    };
  }

  public tick(now: number): void {
    const box = this.#_aabb;
    const sin = Math.sin(now * MODIFIER);

    box.min.x = transformRange(sin, -1, 1, -4, -2);
    box.min.y = transformRange(sin, -1, 1, -4, -2);
    box.max.x = transformRange(-sin, -1, 1, 2, 4);
    box.max.y = transformRange(-sin, -1, 1, 2, 4);
  }

  public render(context: CanvasRenderingContext2D, settings: RenderSettings): void {
    drawGrid(context, settings, {
      drawType: 'grid',
      range: new Vector2(20, 20),
      color: '#989898',
      gridColor: '#383838',
    });
    drawAABB(context, settings, {
      drawType: 'aabb',
      fill: 'transparent',
      stroke: 'red',
      aabb: this.#_aabb,
    });
    drawCircle(context, settings, {
      drawType: 'circle',
      fill: 'transparent',
      stroke: 'red',
      circle: this.#_circle,
    });
    drawPoint(context, settings, {
      drawType: 'point',
      position: this.#_point,
      color: 'red',
    });
    drawRay(context, settings, {
      drawType: 'ray',
      ray: this.#_ray,
      color: 'red',
    });
  }

  public cleanup(): void {
    // No need
  }
}

export const createScene: SceneFactory = (_context: SandboxContext): Scene => {
  return new ShapeScene();
};
