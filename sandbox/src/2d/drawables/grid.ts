import { Vector2 } from '@stdlib/math/vector2';

import { RenderSettings } from '../renderer/render-settings';

export interface IDrawableGrid {
  type: 'grid';
  color: string;
  gridColor: string;
  range: Vector2;
}

export function drawGrid(
  ctx: CanvasRenderingContext2D,
  settings: RenderSettings,
  drawable: IDrawableGrid,
): void {
  const { pixelsPerUnit } = settings;

  ctx.save();
  ctx.translate(0, 0);

  // First draw the subgrid
  ctx.beginPath();
  ctx.lineWidth = 1;
  ctx.strokeStyle = drawable.gridColor;

  // TODO: Use pattern here instead?
  for (let x = 1; x < drawable.range.x; x++) {
    const scaledX = x * pixelsPerUnit;
    const maxY = drawable.range.y * pixelsPerUnit;

    ctx.moveTo(scaledX, maxY);
    ctx.lineTo(scaledX, -maxY);
    ctx.moveTo(-scaledX, maxY);
    ctx.lineTo(-scaledX, -maxY);
  }

  for (let y = 1; y < drawable.range.y; y++) {
    const scaledY = y * pixelsPerUnit;
    const maxX = drawable.range.x * pixelsPerUnit;

    ctx.moveTo(-maxX, scaledY);
    ctx.lineTo(maxX, scaledY);
    ctx.moveTo(-maxX, -scaledY);
    ctx.lineTo(maxX, -scaledY);
  }

  ctx.stroke();
  ctx.restore();

  // Then draw the main axis
  ctx.save();

  ctx.lineWidth = 2;
  ctx.strokeStyle = drawable.color;
  ctx.fillStyle = drawable.color;
  ctx.setLineDash([]);

  ctx.beginPath();
  ctx.moveTo(-drawable.range.x * pixelsPerUnit, 0);
  ctx.lineTo(drawable.range.x * pixelsPerUnit, 0);
  ctx.moveTo(0, -drawable.range.y * pixelsPerUnit);
  ctx.lineTo(0, drawable.range.y * pixelsPerUnit);
  ctx.stroke();

  ctx.restore();
}
