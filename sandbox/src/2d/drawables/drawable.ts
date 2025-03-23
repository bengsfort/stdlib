import { RenderSettings } from '../renderer/render-settings.js';

import { drawAABB, IDrawableAABB } from './aabb.js';
import { drawCircle, IDrawableCircle } from './circle.js';
import { drawGrid, IDrawableGrid } from './grid.js';
import { drawPoint, IDrawablePoint } from './point.js';
import { drawRay, IDrawableRay } from './ray.js';

type DrawableMapExtractor<Type extends { drawType: string }> = {
  [T in Type as T['drawType']]: T;
};

type DrawableMap = DrawableMapExtractor<
  IDrawablePoint | IDrawableAABB | IDrawableCircle | IDrawableRay | IDrawableGrid
>;

export type DrawableType = keyof DrawableMap;
export type Drawable<T extends DrawableType = DrawableType> = DrawableMap[T];

export function renderDrawable(
  ctx: CanvasRenderingContext2D,
  settings: RenderSettings,
  drawable: Drawable,
): void {
  switch (drawable.drawType) {
    case 'aabb':
      drawAABB(ctx, settings, drawable);
      return;

    case 'point':
      drawPoint(ctx, settings, drawable);
      return;

    case 'circle':
      drawCircle(ctx, settings, drawable);
      return;

    case 'ray':
      drawRay(ctx, settings, drawable);
      return;

    case 'grid':
      drawGrid(ctx, settings, drawable);
      return;
  }
}
