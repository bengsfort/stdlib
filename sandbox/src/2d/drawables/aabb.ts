import { IAABB2D } from '@stdlib/geometry/primitives';
import { Vector2 } from '@stdlib/math/vector2';

import { RenderSettings } from '../render-settings';

export interface IDrawableAABB {
  type: 'aabb';
  aabb: IAABB2D;
  stroke?: string;
  fill: string;
}

export function drawAABB(
  ctx: CanvasRenderingContext2D,
  settings: RenderSettings,
  drawable: IDrawableAABB,
): void {
  const { pixelsPerUnit } = settings;

  const size = Vector2.Subtract(drawable.aabb.max, drawable.aabb.min);
  const halfSize = Vector2.MultiplyScalar(size, 0.5);
  const position = new Vector2(
    drawable.aabb.min.x + halfSize.x,
    drawable.aabb.min.y + halfSize.y,
  );

  ctx.save();
  ctx.fillStyle = drawable.fill;
  ctx.strokeStyle = drawable.stroke ?? 'transparent';

  ctx.translate(position.x * pixelsPerUnit, position.y * pixelsPerUnit);
  ctx.rect(
    -halfSize.x * pixelsPerUnit,
    -halfSize.y * pixelsPerUnit,
    size.x * pixelsPerUnit,
    size.y * pixelsPerUnit,
  );

  ctx.fill();
  ctx.stroke();
  ctx.restore();
}
