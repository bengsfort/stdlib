import { Vector2 } from '@stdlib/math/vector2';

import { SandboxContext } from '../context';

export interface SceneObject {
  position: Vector2;
}

export interface Scene {
  objects: SceneObject[];
  tick(now: number): void;
  cleanup(): void;
}

export type SceneFactory = (context: SandboxContext) => Scene;
