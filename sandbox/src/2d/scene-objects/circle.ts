import { ICircle } from '@stdlib/geometry/primitives.js';
import { Vector2 } from '@stdlib/math/vector2.js';

import { SandboxContext } from '../context.js';
import { IDrawableCircle } from '../drawables/circle.js';
import { SceneObject } from '../scenes/scene.js';

import { DrawableObject } from './drawable-object.js';

export class Circle extends DrawableObject implements ICircle {
  public readonly position: Vector2;
  public radius: number;
  public color: string;

  constructor(ctx: SandboxContext, pos: Vector2, radius: number, color = '#fff') {
    super(ctx);

    this.position = pos;
    this.radius = radius;
    this.color = color;
  }

  public getDrawable(): IDrawableCircle {
    return {
      drawType: 'circle',
      circle: {
        position: this.position,
        radius: this.radius,
      },
      fill: 'transparent',
      stroke: this.color,
    };
  }
}
