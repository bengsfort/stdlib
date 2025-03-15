import { Vector2 } from '@stdlib/math/vector2.js';

import { Drawable } from './drawables/drawable.js';
import { Renderer2D } from './renderer.js';

function main(): void {
  const renderer = new Renderer2D();
  renderer.attach();

  const shapes: Drawable[] = [
    {
      type: 'aabb',
      aabb: {
        min: new Vector2(-4, -4),
        max: new Vector2(4, 4),
      },
      fill: 'transparent',
    },
    {
      type: 'circle',
      circle: {
        position: new Vector2(8, 0),
        radius: 3,
      },
      fill: 'transparent',
    },
    {
      type: 'point',
      position: new Vector2(6, 6),
      color: '#f00',
    },
    {
      type: 'ray',
      ray: {
        position: new Vector2(-5, 5),
        direction: new Vector2(1, 0),
      },
      color: '#0f0',
    },
  ];

  const tick = (now: number): void => {
    // TODO: input
    // TODO: logic update
    renderer.render(shapes);
  };

  tick(performance.now());
}

main();
