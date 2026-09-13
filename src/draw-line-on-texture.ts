import { DrawLine } from './draw-line';
import { Application, RenderTexture, Graphics } from 'pixi.js';

export class DrawLineOnTexture implements DrawLine {
  private app: Application;
  private texture: RenderTexture;

  constructor(app: Application, texture: RenderTexture) {
    this.app = app;
    this.texture = texture;
  }

  public draw(
    p1: { x: number; y: number },
    p2: { x: number; y: number },
    color: number,
  ): void {
    const brush = new Graphics()
      .moveTo(p1.x, p1.y)
      .lineTo(p2.x, p2.y)
      .stroke({ width: 2, color });

    this.app.renderer.render({
      container: brush,
      target: this.texture,
      clear: false,
    });

    brush.destroy();
  }
}
