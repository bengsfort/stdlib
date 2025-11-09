import { InputManager } from './input/manager.js';
import { MouseInput } from './input/mouse.js';
import { Renderer2D } from './renderer/renderer.js';
import { Scene } from './scenes/scene.js';
import { createScene } from './scenes/shapes.js';

function main(): void {
  let frameRef = 0;
  let frameCount = 0;

  const input = new InputManager();
  const mouse = new MouseInput();
  const renderer = new Renderer2D();
  const activeScene: Scene = createScene({
    renderer,
    mouse,
    input,
  });

  const tick = (now: number): void => {
    frameRef = requestAnimationFrame(tick);
    frameCount++;

    mouse.tick(frameCount);
    activeScene.tick(now);
    renderer.render(activeScene);
  };

  window.addEventListener('blur', () => {
    cancelAnimationFrame(frameRef);
    console.log('Pausing loop.');
  });

  window.addEventListener('focus', () => {
    frameRef = requestAnimationFrame(tick);
    console.log('Resuming loop.');
  });

  renderer.attach();
  mouse.attach(renderer.getCanvas());
  frameRef = requestAnimationFrame(tick);
}

main();
