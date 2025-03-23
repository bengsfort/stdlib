import { Vector2 } from '@stdlib/math/vector2.js';

import { IDrawableGrid } from '../drawables/grid.js';
import { SceneObject } from '../scenes/scene.js';

export class Grid implements SceneObject {
  public readonly position: Vector2;
  public readonly range: Vector2;
  public color: string;
  public gridColor: string;

  constructor(pos: Vector2, range: Vector2, color = '#fff', gridColor = '#383838') {
    this.position = pos;
    this.range = range;
    this.color = color;
    this.gridColor = gridColor;
  }

  public getDrawable(): IDrawableGrid {
    return {
      drawType: 'grid',
      range: this.range,
      color: this.color,
      gridColor: this.gridColor,
    };
  }
}
