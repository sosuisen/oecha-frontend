import { describe, it, expect, afterEach } from 'vitest';
import { Application, Container, Graphics } from 'pixi.js';
import { createCanvasApp } from './canvas-app';

// jsdom上でCanvasRendererが動くか？
describe('CanvasRenderer on jsdom', () => {
  let app: Application;

  afterEach(() => {
    app?.destroy();
  });

  it('initializes a canvas renderer and extracts pixels', async () => {
    app = await createCanvasApp(100, 100);
    expect(app.renderer.name).toBe('canvas');

    const container = new Container();
    container.addChild(new Graphics().rect(0, 0, 50, 50).fill(0xff0000));

    const { pixels, width } = app.renderer.extract.pixels({
      target: container,
    });
    const index = (25 * width + 25) * 4;
    expect([pixels[index], pixels[index + 1], pixels[index + 2]]).toEqual([
      255, 0, 0,
    ]);
  });
});
