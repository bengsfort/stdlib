import { ICircle } from '@stdlib/geometry/primitives';

import { RenderSettings } from '../renderer/render-settings';

export interface IDrawableCircle {
  type: 'circle';
  circle: ICircle;
  stroke?: string;
  fill: string;
}

const CENTER_POINT_RADIUS = 4;

export function drawCircle(
  ctx: CanvasRenderingContext2D,
  settings: RenderSettings,
  drawable: IDrawableCircle,
): void {
  ctx.save();

  ctx.fillStyle = drawable.fill;
  ctx.strokeStyle = drawable.stroke ?? 'transparent';

  const { pixelsPerUnit } = settings;
  ctx.translate(
    drawable.circle.position.x * pixelsPerUnit,
    drawable.circle.position.y * pixelsPerUnit,
  );

  ctx.beginPath();
  ctx.arc(0, 0, drawable.circle.radius * pixelsPerUnit, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(0, 0, CENTER_POINT_RADIUS, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  ctx.restore();
}
