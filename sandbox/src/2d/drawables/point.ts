import { Vector2 } from '@stdlib/math/vector2';

export interface IDrawablePoint {
  type: 'point';
  position: Vector2;
  color: string;
}

const POINT_RADIUS = 2;

export function drawPoint(ctx: CanvasRenderingContext2D, point: IDrawablePoint): void {
  ctx.save();

  ctx.fillStyle = point.color;
  ctx.translate(point.position.x, point.position.y);
  ctx.roundRect(
    -POINT_RADIUS,
    -POINT_RADIUS,
    POINT_RADIUS * 2,
    POINT_RADIUS * 2,
    POINT_RADIUS,
  );
  ctx.fill();

  ctx.restore();
}
