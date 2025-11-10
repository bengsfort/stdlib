import { makeLogger } from '@stdlib/logging/logger';
import { transformRange } from '@stdlib/math/utils';
import { Vector2 } from '@stdlib/math/vector2';

import { Scene } from '../scenes/scene';

import { defaultRenderSettings, RenderSettings } from './render-settings';

const Log = makeLogger('renderer2d');

function resizeCanvas(canvas: HTMLCanvasElement, width: number, height: number): void {
  const { devicePixelRatio } = window;

  canvas.width = width * devicePixelRatio;
  canvas.height = height * devicePixelRatio;
  canvas.style.width = `${width.toString(10)}px`;
  canvas.style.height = `${height.toString(10)}px`;

  const ctx = canvas.getContext('2d');
  ctx?.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
  ctx?.clearRect(0, 0, width, height);
}

function createCanvas(
  width = window.innerWidth,
  height = window.innerHeight,
): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  resizeCanvas(canvas, width, height);
  return canvas;
}

type UnbindCallback = () => void;
export function bindCanvasToWindow(canvas: HTMLCanvasElement): UnbindCallback {
  const handler = (): void => {
    resizeCanvas(canvas, window.innerWidth, window.innerHeight);
  };

  window.addEventListener('resize', handler);
  return () => {
    window.removeEventListener('resize', handler);
  };
}

export class Renderer2D {
  public readonly settings: RenderSettings;

  #_canvas: HTMLCanvasElement;
  #_ctx: CanvasRenderingContext2D;
  #_unbindCallback: UnbindCallback | null = null;

  constructor(settings: RenderSettings = defaultRenderSettings()) {
    const canvas = createCanvas();
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      throw new Error('Missing rendering context');
    }

    this.settings = settings;
    this.#_canvas = canvas;
    this.#_ctx = ctx;
  }

  public getCanvas(): HTMLCanvasElement {
    return this.#_canvas;
  }

  public attach(): void {
    if (this.#_unbindCallback !== null) {
      Log.warn('Attempting to attach already attached renderer');
      return;
    }

    this.#_unbindCallback = bindCanvasToWindow(this.#_canvas);
    this.#_canvas.style.position = 'absolute';
    this.#_canvas.style.inset = '0';
    document.body.append(this.#_canvas);
  }

  public detach(): void {
    if (this.#_unbindCallback === null) {
      Log.warn('Attempting to detach non-attached renderer');
      return;
    }

    this.#_unbindCallback();
    this.#_unbindCallback = null;
    this.#_canvas.remove();
  }

  public render(scene: Scene): void {
    const { width, height } = this.#_canvas;

    // Clear the canvas.
    this.#_ctx.fillStyle = this.settings.clearColor;
    this.#_ctx.clearRect(0, 0, width, height);
    this.#_ctx.fillRect(0, 0, width, height);
    this.#_ctx.save();
    {
      // Set the base transformation matrices so scene objects are rendered
      // relative to the 'world grid'.
      this.#_ctx.translate(
        width * 0.5 + scene.cameraOrigin.x * this.settings.pixelsPerUnit,
        height * 0.5 + scene.cameraOrigin.y * this.settings.pixelsPerUnit,
      );
      this.#_ctx.scale(1, -1);

      // Render the scene.
      this.#_ctx.save();
      {
        scene.render(this.#_ctx, this.settings);
      }
      this.#_ctx.restore();
    }
    this.#_ctx.restore();
  }

  public getScreenToWorldSpace(scene: Scene, screenPos: Vector2): Vector2 {
    const { width, height } = this.#_canvas;
    const { pixelsPerUnit } = this.settings;

    const maxWorldUnitsX = width / pixelsPerUnit;
    const maxWorldUnitsY = height / pixelsPerUnit;

    const minScreenX = scene.cameraOrigin.x - maxWorldUnitsX * 0.5;
    const minScreenY = scene.cameraOrigin.y - maxWorldUnitsY * 0.5;
    const maxScreenX = scene.cameraOrigin.x + maxWorldUnitsX * 0.5;
    const maxScreenY = scene.cameraOrigin.y + maxWorldUnitsY * 0.5;

    const x = transformRange(screenPos.x, 0, width, minScreenX, maxScreenX);
    const y = transformRange(screenPos.y, 0, height, minScreenY, maxScreenY);

    return new Vector2(x, -y);
  }
}
