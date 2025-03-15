import { IRay2D } from '@stdlib/geometry/primitives';
import { Vector2 } from '@stdlib/math/vector2';

export interface IDrawableRay {
  type: 'ray';
  ray: IRay2D;
  color: string;
}

const POINT_RADIUS = 2;
const RAY_LENGTH = 9999;

export function drawRay(ctx: CanvasRenderingContext2D, drawable: IDrawableRay): void {
  ctx.save();

  const { position, direction } = drawable.ray;
  const end = Vector2.Normalize(direction).multiplyScalar(RAY_LENGTH);

  ctx.fillStyle = drawable.color;
  ctx.translate(position.x, position.y);

  ctx.save();
  ctx.roundRect(
    -POINT_RADIUS,
    -POINT_RADIUS,
    POINT_RADIUS * 2,
    POINT_RADIUS * 2,
    POINT_RADIUS,
  );
  ctx.fill();
  ctx.restore();

  ctx.beginPath();
  ctx.moveTo(position.x, position.y);
  ctx.lineTo(end.x, end.y);
  ctx.stroke();

  ctx.restore();
}
