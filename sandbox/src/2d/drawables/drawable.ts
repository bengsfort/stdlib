import { drawAABB, IDrawableAABB } from './aabb.js';
import { drawCircle, IDrawableCircle } from './circle.js';
import { drawPoint, IDrawablePoint } from './point.js';
import { drawRay, IDrawableRay } from './ray.js';

type DrawableMapExtractor<Type extends { type: string }> = {
  [T in Type as T['type']]: T;
};

type DrawableMap = DrawableMapExtractor<
  IDrawablePoint | IDrawableAABB | IDrawableCircle | IDrawableRay
>;

export type DrawableType = keyof DrawableMap;
export type Drawable<T extends DrawableType = DrawableType> = DrawableMap[T];

export function renderDrawable(ctx: CanvasRenderingContext2D, drawable: Drawable): void {
  switch (drawable.type) {
    case 'aabb':
      drawAABB(ctx, drawable);
      return;

    case 'point':
      drawPoint(ctx, drawable);
      return;

    case 'circle':
      drawCircle(ctx, drawable);
      return;

    case 'ray':
      drawRay(ctx, drawable);
      return;
  }
}
