import { Vector2 } from '@stdlib/math/vector2';

import { RenderSettings } from '../renderer/render-settings';

export interface IDrawablePoint {
  drawType: 'point';
  position: Vector2;
  color: string;
}

const POINT_RADIUS = 4;

export function drawPoint(
  ctx: CanvasRenderingContext2D,
  settings: RenderSettings,
  point: IDrawablePoint,
): void {
  const { pixelsPerUnit } = settings;
  ctx.save();
  ctx.fillStyle = point.color;

  ctx.translate(point.position.x * pixelsPerUnit, point.position.y * pixelsPerUnit);
  ctx.beginPath();
  ctx.arc(0, 0, POINT_RADIUS, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}
