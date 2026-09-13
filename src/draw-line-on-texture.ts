import { DrawLine, DrawOptions } from './draw-line';
import {
  Application,
  RenderTexture,
  Graphics,
  BLEND_MODES,
  PointData,
} from 'pixi.js';

export class DrawLineOnTexture implements DrawLine {
  private app: Application;
  private texture: RenderTexture;

  constructor(app: Application, texture: RenderTexture) {
    this.app = app;
    this.texture = texture;
  }

  public draw(p1: PointData, p2: PointData, drawOptions: DrawOptions): void {
    const lineWidth = 2;
    let brush: Graphics;
    let color = drawOptions.color;

    let blendMode: BLEND_MODES = 'normal';
    if (drawOptions.blendMode === 'erase') {
      color = 0xffffff;
      blendMode = 'erase';
    }

    if (p1.x === p2.x && p1.y === p2.y) {
      brush = new Graphics()
        .moveTo(p1.x, p1.y)
        .circle(p1.x, p1.y, lineWidth / 2)
        .fill({ color });
    } else {
      brush = new Graphics()
        .moveTo(p1.x, p1.y)
        .lineTo(p2.x, p2.y)
        .stroke({ width: lineWidth, color });
    }
    brush.blendMode = blendMode;

    this.app.renderer.render({
      container: brush,
      target: this.texture,
      clear: false,
    });

    brush.destroy();
  }
}
