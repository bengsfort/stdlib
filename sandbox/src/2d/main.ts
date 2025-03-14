import { Renderer2D } from './renderer.js';

function main(): void {
  const renderer = new Renderer2D();
  renderer.attach();

  const tick = (now: number): void => {
    // TODO: input
    // TODO: logic update
    renderer.render();
  };

  tick(performance.now());
}

main();
