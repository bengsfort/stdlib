import { IRay2D } from '@stdlib/geometry/primitives';
import { Vector2 } from '@stdlib/math/vector2';

import { RenderSettings } from '../renderer/render-settings';

export interface IDrawableRay {
  type: 'ray';
  ray: IRay2D;
  color: string;
}

const RAY_LENGTH = 9999;

export function drawRay(
  ctx: CanvasRenderingContext2D,
  settings: RenderSettings,
  drawable: IDrawableRay,
): void {
  ctx.save();

  const { pixelsPerUnit } = settings;
  const { position, direction } = drawable.ray;

  const scaledPosition = Vector2.MultiplyScalar(position, pixelsPerUnit);
  const end = Vector2.Normalize(direction).multiplyScalar(RAY_LENGTH);

  ctx.fillStyle = drawable.color;
  ctx.translate(scaledPosition.x, scaledPosition.y);

  ctx.strokeStyle = drawable.color;
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(end.x, end.y);
  ctx.stroke();

  ctx.restore();
}
