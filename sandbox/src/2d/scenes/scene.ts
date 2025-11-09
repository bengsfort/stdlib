import type { Vector2 } from '@stdlib/math/vector2';

import type { SandboxContext } from '../context';
import type { RenderSettings } from '../renderer/render-settings';

export interface SceneObject {
  position: Vector2;
}

export interface Scene {
  cameraOrigin: Vector2;
  tick(now: number): void;
  render(context: CanvasRenderingContext2D, settings: RenderSettings): void;
  cleanup(): void;
}

export type SceneFactory = (context: SandboxContext) => Scene;
