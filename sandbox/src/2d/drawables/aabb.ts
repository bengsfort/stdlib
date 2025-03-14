import { IAABB2D } from "@stdlib/geometry/primitives";
import { Vector2 } from "@stdlib/math/vector2";

export interface IDrawableAABB {
  aabb: IAABB2D;
  stroke?: string;
  fill: string;
}

export function drawAABB(ctx: CanvasRenderingContext2D, drawable: IDrawableAABB): void {
  ctx.save();

  const size = Vector2.Subtract(drawable.aabb.max, drawable.aabb.min);
  const halfSize = Vector2.MultiplyScalar(size, 0.5);
  const position = new Vector2(
    drawable.aabb.min.x + halfSize.x,
    drawable.aabb.min.y + halfSize.y,
  );

  ctx.fillStyle = drawable.fill;
  ctx.strokeStyle = drawable.stroke ?? 'transparent';

  ctx.translate(position.x, position.y);
  ctx.rect(-halfSize.x, -halfSize.y, size.x, size.y);

  ctx.fill();
  ctx.stroke();


  ctx.restore();
}
