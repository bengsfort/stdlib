import { IAABB2D, ICircle, IRay2D } from '@stdlib/geometry/primitives';
import { Vector2 } from '@stdlib/math/vector2';

import { drawAABB, IDrawableAABB } from '../drawables/aabb';
import { drawCircle, IDrawableCircle } from '../drawables/circle';
import {
  Drawable,
  DrawableRenderFn,
  DrawableType,
  renderDrawable,
} from '../drawables/drawable';
import { drawGrid, IDrawableGrid } from '../drawables/grid';
import { drawPoint, IDrawablePoint } from '../drawables/point';
import { drawRay, IDrawableRay } from '../drawables/ray';

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

interface IDrawableRender {
  data: ImageData;
  position: Vector2;
  zIndex: number;
}

interface IDrawCommand {
  resourceId: number;
  drawable: Drawable;
  size: Vector2;
  renderFn: DrawableRenderFn;
}

class Compositor2D {
  public readonly bufferMaxHeight = 1000;
  public readonly pixelsPerUnit = 16;

  #_nextResourceId = 0;
  #_renderBuffer: CanvasRenderingContext2D;
  #_drawBuffers = new Map<number, IDrawableRender>();
  #_drawCommands = new Map<number, IDrawCommand>();
  #_dirty = new Set<IDrawCommand>();

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

  public deleteResource(rid: number): void {
    // Remove all instances of the resource.
    this.#_drawBuffers.delete(rid);
    this.#_drawCommands.delete(rid);

    // Remove from dirty list.
    for (const dirty of this.#_dirty) {
      if (dirty.resourceId !== rid) {
        continue;
      }

      this.#_dirty.delete(dirty);
      break;
    }
  }

  public drawAABB(rid: number, aabb: IAABB2D, fill: string, stroke: string): void {
    const drawable: IDrawableAABB = {
      drawType: 'aabb',
      aabb,
      fill,
      stroke,
    };

    const command: IDrawCommand = {
      resourceId: rid,
      drawable,
      size: new Vector2(aabb.max.x - aabb.min.x, aabb.max.y - aabb.min.y),
      renderFn: drawAABB as DrawableRenderFn,
    };

    const halfSize = Vector2.MultiplyScalar(command.size, 0.5);

    this.#_dirty.add(command);
    this.#_drawCommands.set(rid, command);
    this.#_drawBuffers.set(rid, {
      data: new ImageData(0, 0),
      position: Vector2.Add(aabb.min, halfSize),
      zIndex: 0,
    });
  }

  public drawCircle(rid: number, circle: ICircle, fill: string, stroke: string): void {
    const drawable: IDrawableCircle = {
      drawType: 'circle',
      circle,
      fill,
      stroke,
    };

    const command: IDrawCommand = {
      resourceId: rid,
      drawable,
      size: new Vector2(circle.radius * 2, circle.radius * 2),
      renderFn: drawCircle as DrawableRenderFn,
    };

    this.#_dirty.add(command);
    this.#_drawCommands.set(rid, command);
    this.#_drawBuffers.set(rid, {
      data: new ImageData(0, 0),
      position: new Vector2(circle.position),
      zIndex: 0,
    });
  }

  public drawPoint(rid: number, point: Vector2, color: string): void {
    const drawable: IDrawablePoint = {
      drawType: 'point',
      position: point,
      color,
    };

    const command: IDrawCommand = {
      resourceId: rid,
      drawable,
      size: new Vector2(2, 2),
      renderFn: drawPoint as DrawableRenderFn,
    };

    this.#_dirty.add(command);
    this.#_drawCommands.set(rid, command);
    this.#_drawBuffers.set(rid, {
      data: new ImageData(0, 0),
      position: point.copy(),
      zIndex: 0,
    });
  }

  public drawRay(rid: number, ray: IRay2D, color: string): void {
    const drawable: IDrawableRay = {
      drawType: 'ray',
      ray,
      color,
    };

    const size = Vector2.MultiplyScalar(Vector2.Normalize(ray.direction), 1000);
    const command: IDrawCommand = {
      resourceId: rid,
      drawable,
      size,
      renderFn: drawRay as DrawableRenderFn,
    };

    this.#_dirty.add(command);
    this.#_drawCommands.set(rid, command);
    this.#_drawBuffers.set(rid, {
      data: new ImageData(0, 0),
      position: new Vector2(ray.position),
      zIndex: 0,
    });
  }

  public drawGrid(rid: number, range: Vector2, color: string, gridColor: string): void {
    const drawable: IDrawableGrid = {
      drawType: 'grid',
      range,
      color,
      gridColor,
    };

    const command: IDrawCommand = {
      resourceId: rid,
      drawable,
      size: range.copy(),
      renderFn: drawGrid as DrawableRenderFn,
    };

    this.#_dirty.add(command);
    this.#_drawCommands.set(rid, command);
    this.#_drawBuffers.set(rid, {
      data: new ImageData(0, 0),
      position: Vector2.Zero(),
      zIndex: -1,
    });
  }

  public composite(context: CanvasRenderingContext2D, settings: RenderSettings): void {
    this.#_preRenderDirtyCommands(settings);

    context.clearRect(0, 0, context.canvas.width, context.canvas.height);

    // TODO: Sort by z-index
    const buffers = [...this.#_drawBuffers.entries()];

    for (const [_rid, buffer] of buffers) {
      context.putImageData(
        buffer.data,
        buffer.position.x - buffer.data.width * 0.5,
        buffer.position.y - buffer.data.height * 0.5,
      );
    }
  }

  #_preRenderDirtyCommands(settings: RenderSettings): void {
    if (this.#_dirty.size < 1) {
      return;
    }

    const dirty = [...this.#_dirty];
    this.#_dirty.clear();

    const context = this.#_renderBuffer;
    const canvas = context.canvas;

    for (const command of dirty) {
      // Clear canvas and update size
      canvas.width = 0;
      canvas.height = 0;
      canvas.width = command.size.x;
      canvas.height = command.size.y;

      command.renderFn(context, settings, command.drawable);
      const data = context.getImageData(0, 0, command.size.x, command.size.y);

      let buffer = this.#_drawBuffers.get(command.resourceId);
      if (!buffer) {
        buffer = {
          data,
          position: Vector2.Zero(),
          zIndex: 0,
        };
      }

      this.#_drawBuffers.set(command.resourceId, {
        ...buffer,
        data,
      });
    }
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

  // TODO: Instead add forwarding API on the renderer itself to not expose the
  // underlying compositor.
  public getCompositor(): Compositor2D {
    return this.#_compositor;
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

    this.#_compositor.composite(this.#_ctx, this.settings);

    this.#_ctx.restore();
  }
}
