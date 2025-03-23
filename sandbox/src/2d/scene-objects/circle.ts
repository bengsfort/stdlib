import { ICircle } from '@stdlib/geometry/primitives.js';
import { Vector2 } from '@stdlib/math/vector2.js';

import { IDrawableCircle } from '../drawables/circle.js';
import { SceneObject } from '../scenes/scene.js';

export class Circle implements SceneObject, ICircle {
  public readonly position: Vector2;
  public radius: number;
  public color: string;

  constructor(pos: Vector2, radius: number, color = '#fff') {
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
