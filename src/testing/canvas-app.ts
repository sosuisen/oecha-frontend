import { Application } from 'pixi.js';

export async function createCanvasApp(
  width: number,
  height: number,
): Promise<Application> {
  const app = new Application();
  await app.init({
    preference: 'canvas',
    autoStart: false,
    width,
    height,
  });
  return app;
}
