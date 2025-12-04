import { Vector2 } from '@stdlib/math/vector2';

import { SandboxContext } from '../context';
import { drawGrid, IDrawableGrid } from '../drawables/grid';
import { MouseInput } from '../input/mouse';
import { RenderSettings } from '../renderer/render-settings';
import { Renderer2D } from '../renderer/renderer';

import { Scene } from './scene';

export class BallPhysicsScene implements Scene {
  public readonly cameraOrigin: Vector2;

  #_grid: IDrawableGrid;

  #_renderer: Renderer2D;
  #_mouseInput: MouseInput;

  constructor({ renderer, mouse }: SandboxContext) {
    this.#_renderer = renderer;
    this.#_mouseInput = mouse;
    this.cameraOrigin = new Vector2();

    const { width, height } = renderer.getCanvas();
    const maxWorldUnitsX = width / renderer.settings.pixelsPerUnit;
    const maxWorldUnitsY = height / renderer.settings.pixelsPerUnit;

    const halfMaxX = maxWorldUnitsX * 0.5;
    const halfMaxY = maxWorldUnitsY * 0.5;

    this.#_grid = {
      drawType: 'grid',
      color: '#fff',
      gridColor: '#222',
      range: new Vector2(halfMaxX, halfMaxY),
    };
  }

  public tick(_now: number): void {}

  public render(context: CanvasRenderingContext2D, settings: RenderSettings): void {
    drawGrid(context, settings, this.#_grid);
  }

  public cleanup(): void {
    throw new Error('Method not implemented.');
  }
}
