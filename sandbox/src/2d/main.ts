import { CompositeRenderer2D } from './renderer/compositor.js';
import { Scene } from './scenes/scene.js';
import { createScene } from './scenes/shapes.js';

function main(): void {
  let frameRef = 0;

  const renderer = new CompositeRenderer2D();
  renderer.attach();

  const activeScene: Scene = createScene({
    renderer,
  });

  const tick = (now: number): void => {
    frameRef = requestAnimationFrame(tick);

    // TODO: input
    activeScene.tick(now);
  };

  frameRef = requestAnimationFrame(tick);

  window.addEventListener('blur', () => {
    cancelAnimationFrame(frameRef);
    console.log('Pausing loop.');
  });

  window.addEventListener('focus', () => {
    frameRef = requestAnimationFrame(tick);
    console.log('Resuming loop.');
  });
}

main();
