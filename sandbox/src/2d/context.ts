import { InputManager } from './input/manager.js';
import { MouseInput } from './input/mouse.js';
import { Renderer2D } from './renderer/renderer.js';

export interface Time {
  frameNumber: number;
  timeSinceStart: number;
  deltaTime: number;
  now: number;
}

export interface SandboxContext {
  renderer: Renderer2D;
  mouse: MouseInput;
  input: InputManager;
  time: Time;
}
