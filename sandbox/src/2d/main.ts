import { makeLogger } from '@stdlib/logging/logger.js';

import { SandboxContext } from './context.js';
import { InputManager } from './input/manager.js';
import { MouseInput } from './input/mouse.js';
import { Renderer2D } from './renderer/renderer.js';
import { ShapeCollisionsScene } from './scenes/shape-collisions.js';

import { RepeatingArray } from '@/utils/fixed-array.js';

const Log = makeLogger('sandbox2d');

interface Timing {
  frameStart: number;
  updateEnd: number;
  drawEnd: number;
}

function drawFps(last100: RepeatingArray<Timing>, canvas: HTMLCanvasElement): void {
  // Calculate average
  let totalDraw = 0;
  let totalUpdate = 0;
  let totalFrame = 0;
  let drawMax = 0;
  let updateMax = 0;
  let frameMax = 0;

  for (const timing of last100) {
    const frameTime = timing.drawEnd - timing.frameStart;
    const drawTime = timing.drawEnd - timing.updateEnd;
    const updateTime = timing.updateEnd - timing.frameStart;

    totalFrame += frameTime;
    totalDraw += drawTime;
    totalUpdate += updateTime;

    if (frameMax < frameTime) frameMax = frameTime;
    if (drawMax < drawTime) drawMax = drawTime;
    if (updateMax < updateTime) updateMax = updateTime;
  }

  const sampleCount = last100.getCount();
  const avgDraw = totalDraw / sampleCount;
  const avgUpdate = totalUpdate / sampleCount;
  const avgFrame = totalFrame / sampleCount;
  const fps = 1000 / avgFrame;

  // Draw
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  ctx.save();
  {
    const x = 8;
    const y = 0;
    ctx.font = '14px monospace';

    // Measure the text strings so can figure out positioning.
    const fpsStr = `avg fps ${fps.toFixed(0)} (${avgFrame.toFixed(2)}ms / ${avgUpdate.toFixed(2)}ms update / ${avgDraw.toFixed(2)}ms draw)`;
    const maxStr = `max fps ${frameMax.toFixed(2)}ms / max update ${updateMax.toFixed(2)}ms / max draw ${drawMax.toFixed(2)}ms`;

    const fpsSize = ctx.measureText(fpsStr);
    const maxSize = ctx.measureText(maxStr);

    const fpsHeight = fpsSize.fontBoundingBoxAscent + fpsSize.fontBoundingBoxDescent;
    const maxHeight = maxSize.fontBoundingBoxAscent + maxSize.fontBoundingBoxDescent;

    // Draw the strings in a nice lil box
    ctx.globalAlpha = 0.5;
    ctx.fillStyle = '#000';
    ctx.fillRect(x, y, Math.max(fpsSize.width, maxSize.width), fpsHeight + maxHeight);
    ctx.globalAlpha = 1.0;

    ctx.fillStyle = '#fff';
    ctx.fillText(fpsStr, x, y + fpsSize.fontBoundingBoxAscent);
    ctx.fillText(maxStr, x, y + fpsHeight + maxSize.fontBoundingBoxAscent);
  }
  ctx.restore();
}

function main(): void {
  let frameRef = 0;
  let frameCount = 0;

  let frameStart = performance.now();
  let updateEnd = -1;
  let drawEnd = -1;

  const frameTimes = new RepeatingArray<Timing>(100);
  const input = new InputManager();
  const mouse = new MouseInput();
  const renderer = new Renderer2D();
  const context: SandboxContext = {
    renderer,
    mouse,
    input,
  };

  // const activeScene: Scene = createScene({
  //   renderer,
  //   mouse,
  //   input,
  // });
  const activeScene = ShapeCollisionsScene.Create(context);

  const tick = (now: number): void => {
    frameRef = requestAnimationFrame(tick);
    frameCount++;

    frameStart = now;
    mouse.tick(frameCount);
    activeScene.tick(now);
    updateEnd = performance.now();
    renderer.render(activeScene);
    drawEnd = performance.now();

    frameTimes.add({
      frameStart,
      updateEnd,
      drawEnd,
    });
    drawFps(frameTimes, renderer.getCanvas());
  };

  window.addEventListener('blur', () => {
    cancelAnimationFrame(frameRef);
    Log.info('Pausing loop.');
  });

  window.addEventListener('focus', () => {
    frameRef = requestAnimationFrame(tick);
    Log.info('Resuming loop.');
  });

  renderer.attach();
  mouse.attach(renderer.getCanvas());
  frameRef = requestAnimationFrame(tick);
}

main();
