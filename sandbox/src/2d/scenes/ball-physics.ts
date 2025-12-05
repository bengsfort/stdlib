import { IAABB2D, ICircle } from '@stdlib/geometry/primitives';
import { Vector2 } from '@stdlib/math/vector2';

import { SandboxContext, Time } from '../context';
import { drawAABB, IDrawableAABB } from '../drawables/aabb';
import { drawCircle, IDrawableCircle } from '../drawables/circle';
import { drawGrid, IDrawableGrid } from '../drawables/grid';
import { drawRay, IDrawableRay } from '../drawables/ray';
import { MouseInput } from '../input/mouse';
import { RenderSettings } from '../renderer/render-settings';
import { Renderer2D } from '../renderer/renderer';

import { Scene } from './scene';

const RESET_PLANE = -10;
const WALLS_WIDTH = 6;
const ADD_BALL_DELAY_MS = 120;
const GRAVITY_CONSTANT = -7;
const BUMPER_BOUNCE_STRENGTH = 2;

const BALL_MAX_SPEED = 5;

const squareBumpersPos = [new Vector2(3, 0), new Vector2(-3, -4)];
const circleBumpersPos = [new Vector2(0, -2), new Vector2(-3, 0), new Vector2(3, -4)];

interface BallState {
  circle: ICircle;
  velocity: Vector2;
  direction: Vector2;
  launchFrame: number;
  launchStrength: number;
  bumperBounceFrame: number;
}

const createWall = (aabb: IAABB2D): IDrawableAABB => ({
  drawType: 'aabb',
  aabb,
  fill: '#aa3',
});

const createCircle = (circle: ICircle): IDrawableCircle => ({
  drawType: 'circle',
  circle,
  fill: '#a35',
});

const drawCircleBumper = (circle: ICircle): IDrawableCircle => ({
  drawType: 'circle',
  circle,
  fill: '#838',
});

const drawSquareBumper = (aabb: IAABB2D): IDrawableAABB => ({
  drawType: 'aabb',
  aabb,
  fill: '#838',
});

export class BallPhysicsScene implements Scene {
  public readonly cameraOrigin: Vector2;

  #_resetLine: IDrawableRay;
  #_grid: IDrawableGrid;

  #_squareBumpers: IAABB2D[];
  #_circleBumpers: ICircle[];
  #_walls: IAABB2D[];
  #_balls: BallState[];

  #_lastBallAdded: number;
  #_renderer: Renderer2D;
  #_mouseInput: MouseInput;

  constructor({ renderer, mouse }: SandboxContext) {
    this.#_renderer = renderer;
    this.#_mouseInput = mouse;
    this.cameraOrigin = new Vector2();

    this.#_lastBallAdded = -1;
    this.#_balls = [];

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

    this.#_resetLine = {
      drawType: 'ray',
      color: '#aa3',
      ray: {
        position: new Vector2(halfMaxX, RESET_PLANE),
        direction: Vector2.Left(),
      },
    };

    this.#_walls = [
      {
        min: new Vector2(-halfMaxX, -halfMaxY),
        max: new Vector2(-halfMaxX + WALLS_WIDTH, halfMaxY),
      },
      {
        min: new Vector2(halfMaxX - WALLS_WIDTH, -halfMaxY),
        max: new Vector2(halfMaxX, halfMaxY),
      },
    ];

    this.#_circleBumpers = circleBumpersPos.map((position) => ({
      position,
      radius: 0.75,
    }));

    this.#_squareBumpers = squareBumpersPos.map((pos) => ({
      min: new Vector2(pos.x - 0.75, pos.y - 0.75),
      max: new Vector2(pos.x + 0.75, pos.y + 0.75),
    }));
  }

  public tick(time: Time): void {
    // Spawn a ball if there has been a click.
    const addBallCdEnd = this.#_lastBallAdded + ADD_BALL_DELAY_MS;
    if (this.#_mouseInput.getMouse1Pressed() && addBallCdEnd < time.now) {
      const { mousePosition } = this.#_mouseInput;
      const worldPos = this.#_renderer.getScreenToWorldSpace(this, mousePosition);
      this.#spawnBall(worldPos);
      this.#_lastBallAdded = time.now;
    }

    const balls = this.#_balls.splice(0, this.#_balls.length);
    for (const ball of balls) {
      this.#physicsTick(ball, time);
      ball.circle.position.x += ball.velocity.x;
      ball.circle.position.y += ball.velocity.y;

      if (ball.circle.position.y > RESET_PLANE) {
        this.#_balls.push(ball);
      }
    }
  }

  public render(context: CanvasRenderingContext2D, settings: RenderSettings): void {
    drawGrid(context, settings, this.#_grid);
    drawRay(context, settings, this.#_resetLine);

    for (const wall of this.#_walls) {
      drawAABB(context, settings, createWall(wall));
    }

    for (const bumper of this.#_circleBumpers) {
      drawCircle(context, settings, drawCircleBumper(bumper));
    }

    for (const bumper of this.#_squareBumpers) {
      drawAABB(context, settings, drawSquareBumper(bumper));
    }

    for (const ball of this.#_balls) {
      drawCircle(context, settings, createCircle(ball.circle));
    }
  }

  public cleanup(): void {
    throw new Error('Method not implemented.');
  }

  #physicsTick(ball: BallState, time: Time): void {
    ball.velocity.y += GRAVITY_CONSTANT * time.deltaTime;
  }

  #spawnBall(position: Vector2): void {
    this.#_balls.push({
      circle: {
        position,
        radius: 0.45,
      },
      velocity: Vector2.Zero(),
      direction: Vector2.Zero(),
      launchFrame: 0,
      launchStrength: 1,
      bumperBounceFrame: -1,
    });
  }
}
