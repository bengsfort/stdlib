import { IAABB2D, ICircle } from '@stdlib/geometry/primitives.js';
import { transformRange } from '@stdlib/math/utils.js';
import { Vector2 } from '@stdlib/math/vector2.js';

import { SandboxContext } from '../context.js';
import { drawAABB } from '../drawables/aabb.js';
import { drawCircle } from '../drawables/circle.js';
import { drawGrid, IDrawableGrid } from '../drawables/grid.js';
import { MouseInput } from '../input/mouse.js';
import { RenderSettings } from '../renderer/render-settings.js';
import { Renderer2D } from '../renderer/renderer.js';

import { Scene } from './scene.js';

const RECT_COUNT = 5;
const CIRCLE_COUNT = 3;
const SHAPE_MIN_SIZE = 0.5;
const SHAPE_MAX_SIZE = 3;

const SHAPE_COLOR = '#0000ff';
const SHAPE_COLLISION_COLOR = '#ff0000';
const POINTER_COLOR = '#fff';
const POINTER_COLLISION_COLOR = '#00ff00';

function getRandomRect(position: Vector2): IAABB2D {
  const widthSeed = Math.random();
  const heightSeed = Math.random();
  const halfWidth = transformRange(widthSeed, 0, 1, SHAPE_MIN_SIZE, SHAPE_MAX_SIZE) * 0.5;
  const halfHeight =
    transformRange(heightSeed, 0, 1, SHAPE_MIN_SIZE, SHAPE_MAX_SIZE) * 0.5;

  return {
    min: {
      x: position.x - halfWidth,
      y: position.y - halfHeight,
    },
    max: {
      x: position.x + halfWidth,
      y: position.y + halfHeight,
    },
  };
}

function getRandomCircle(position: Vector2): ICircle {
  const seed = Math.random();
  const radius = transformRange(seed, 0, 1, SHAPE_MIN_SIZE, SHAPE_MAX_SIZE);

  return {
    position,
    radius,
  };
}

export class ShapeCollisionsScene implements Scene {
  public readonly cameraOrigin: Vector2;

  #_rects: IAABB2D[];
  #_rectsState: boolean[];
  #_circles: ICircle[];
  #_circlesState: boolean[];
  #_pointer: ICircle;
  #_collision: boolean;
  #_grid: IDrawableGrid;

  #_renderer: Renderer2D;
  #_mouseInput: MouseInput;

  constructor({ renderer, mouse }: SandboxContext) {
    this.#_renderer = renderer;
    this.#_mouseInput = mouse;
    this.cameraOrigin = new Vector2();

    this.#_collision = false;
    this.#_pointer = {
      position: new Vector2(0, 0),
      radius: 1,
    };

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

    this.#_rects = new Array<IAABB2D>(RECT_COUNT);
    this.#_rectsState = new Array<boolean>(RECT_COUNT).fill(false);
    for (let i = 0; i < this.#_rects.length; i++) {
      const xSeed = Math.random();
      const ySeed = Math.random();
      const pos = new Vector2(
        transformRange(xSeed, 0, 1, -halfMaxX, halfMaxX),
        transformRange(ySeed, 0, 1, -halfMaxY, halfMaxY),
      );
      this.#_rects[i] = getRandomRect(pos);
    }

    this.#_circles = new Array<ICircle>(CIRCLE_COUNT);
    this.#_circlesState = new Array<boolean>(CIRCLE_COUNT).fill(false);
    for (let i = 0; i < this.#_circles.length; i++) {
      const xSeed = Math.random();
      const ySeed = Math.random();
      const pos = new Vector2(
        transformRange(xSeed, 0, 1, -halfMaxX, halfMaxX),
        transformRange(ySeed, 0, 1, -halfMaxY, halfMaxY),
      );
      this.#_circles[i] = getRandomCircle(pos);
    }
  }

  public tick(_now: number): void {
    // TODO: This needs to be translated to world space
    const { pixelsPerUnit } = this.#_renderer.settings;
    const { mousePosition } = this.#_mouseInput;
    const worldPos = this.#_renderer.getScreenToWorldSpace(
      mousePosition.copy().divideScalar(pixelsPerUnit),
    );
    this.#_pointer.position.x = worldPos.x;
    this.#_pointer.position.y = worldPos.y;

    // TODO: Check collision
  }

  public render(context: CanvasRenderingContext2D, settings: RenderSettings): void {
    drawGrid(context, settings, this.#_grid);

    // Draw rects
    for (let i = 0; i < this.#_rects.length; i++) {
      drawAABB(context, settings, {
        drawType: 'aabb',
        aabb: this.#_rects[i],
        fill: 'transparent',
        stroke: this.#_rectsState[i] ? SHAPE_COLLISION_COLOR : SHAPE_COLOR,
      });
    }

    // Draw circles
    for (let i = 0; i < this.#_circles.length; i++) {
      drawCircle(context, settings, {
        drawType: 'circle',
        circle: this.#_circles[i],
        fill: 'transparent',
        stroke: this.#_circlesState[i] ? SHAPE_COLLISION_COLOR : SHAPE_COLOR,
      });
    }

    // Draw the pointer
    drawCircle(context, settings, {
      drawType: 'circle',
      circle: this.#_pointer,
      fill: 'transparent',
      stroke: this.#_collision ? POINTER_COLLISION_COLOR : POINTER_COLOR,
    });
  }

  public cleanup(): void {
    // todo
  }

  public static Create(context: SandboxContext): ShapeCollisionsScene {
    return new ShapeCollisionsScene(context);
  }
}
