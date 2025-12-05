import type { Vector2 } from '@stdlib/math/vector2';

import type { SandboxContext, Time } from '../context';
import type { RenderSettings } from '../renderer/render-settings';

export interface SceneObject {
  position: Vector2;
}

export interface Scene {
  cameraOrigin: Vector2;
  tick(time: Time): void;
  render(context: CanvasRenderingContext2D, settings: RenderSettings): void;
  cleanup(): void;
}

export type SceneFactory = (context: SandboxContext) => Scene;
