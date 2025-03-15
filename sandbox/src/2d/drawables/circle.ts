import { ICircle } from '@stdlib/geometry/primitives';
import { Vector2 } from '@stdlib/math/vector2';

export interface IDrawableCircle {
  type: 'circle';
  circle: ICircle;
  stroke?: string;
  fill: string;
}

export function drawCircle(
  ctx: CanvasRenderingContext2D,
  drawable: IDrawableCircle,
): void {
  ctx.save();

  const halfSize = new Vector2(drawable.circle.radius, drawable.circle.radius);
  const size = Vector2.MultiplyScalar(halfSize, 2);

  ctx.fillStyle = drawable.fill;
  ctx.strokeStyle = drawable.stroke ?? 'transparent';

  ctx.translate(drawable.circle.position.x, drawable.circle.position.y);
  ctx.roundRect(-halfSize.x, -halfSize.y, size.x, size.y, drawable.circle.radius);

  ctx.fill();
  ctx.stroke();

  ctx.restore();
}
