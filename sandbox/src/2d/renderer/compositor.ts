import { Vector2 } from '@stdlib/math/vector2';

import { IDrawableAABB } from '../drawables/aabb';
import { IDrawableCircle } from '../drawables/circle';
import { Drawable, renderDrawable } from '../drawables/drawable';
import { IDrawablePoint } from '../drawables/point';
import { IDrawableRay } from '../drawables/ray';

import { defaultRenderSettings, RenderSettings } from './render-settings';

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

interface IDrawCommand {
  data: ImageData;
  position: Vector2;
  zIndex: number;
}

class Compositor2D {
  public readonly bufferMaxHeight = 1000;
  public readonly pixelsPerUnit = 16;

  #_nextResourceId = 0;
  #_resourceIds = new Set<number>();
  #_renderBuffer: CanvasRenderingContext2D;
  #_drawBuffers = new Map<number, IDrawCommand>();

  #_aabbDraws = new Map<number, IDrawableAABB>();
  #_circleDraws = new Map<number, IDrawableCircle>();
  #_pointDraws = new Map<number, IDrawablePoint>();
  #_rayDraws = new Map<number, IDrawableRay>();

  constructor() {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Missing 2D context');

    this.#_renderBuffer = ctx;
  }

  public createResource(): number {
    const rid = this.#_nextResourceId++;
    return rid;
  }
}

export class CompositeRenderer2D {
  public readonly settings: RenderSettings;

  #_canvas: HTMLCanvasElement;
  #_ctx: CanvasRenderingContext2D;
  #_unbindCallback: UnbindCallback | null = null;
  #_compositor: Compositor2D;

  constructor(settings: RenderSettings = defaultRenderSettings()) {
    const canvas = createCanvas();
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      throw new Error('Missing rendering context');
    }

    this.settings = settings;
    this.#_canvas = canvas;
    this.#_ctx = ctx;
    this.#_compositor = new Compositor2D();
  }

  public attach(): void {
    if (this.#_unbindCallback !== null) {
      console.warn('Attempting to attach already attached renderer');
      return;
    }

    this.#_unbindCallback = bindCanvasToWindow(this.#_canvas);
    this.#_canvas.style.position = 'absolute';
    this.#_canvas.style.inset = '0';
    document.body.append(this.#_canvas);
  }

  public detach(): void {
    if (this.#_unbindCallback === null) {
      console.warn('Attempting to detach non-attached renderer');
      return;
    }

    this.#_unbindCallback();
    this.#_unbindCallback = null;
    this.#_canvas.remove();
  }

  public render(): void {
    const { width, height } = this.#_canvas;

    this.#_ctx.clearRect(0, 0, width, height);
    this.#_ctx.save();

    this.#_ctx.fillStyle = this.settings.clearColor;
    this.#_ctx.fillRect(0, 0, width, height);

    this.#_ctx.translate(width * 0.5, height * 0.5);
    this.#_ctx.scale(1, -1);

    for (const drawable of drawables) {
      this.#_ctx.save();
      this.#_ctx.beginPath();
      renderDrawable(this.#_ctx, this.settings, drawable);
      this.#_ctx.restore();
    }

    this.#_ctx.restore();
  }
}
