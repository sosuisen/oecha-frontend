import { DrawingSurface, DrawOptions } from './drawing-surface';
import {
  Application,
  Container,
  RenderTexture,
  Graphics,
  BLEND_MODES,
  PointData,
} from 'pixi.js';
import { Rect } from './rect';

export class TextureSurface implements DrawingSurface {
  private readonly app: Application;
  private readonly texture: RenderTexture;

  // renderer.render() ignores the blendMode of the container it receives,
  // so the brush is drawn as a child of this parent.
  private readonly scene = new Container();

  constructor(app: Application) {
    this.app = app;
    this.texture = RenderTexture.create({
      width: app.canvas.width,
      height: app.canvas.height,
    });
  }

  getTexture(): RenderTexture {
    return this.texture;
  }

  drawLine(p1: PointData, p2: PointData, drawOptions: DrawOptions): void {
    const lineWidth = drawOptions.size;

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
        .stroke({ width: lineWidth, color, cap: 'round' });
    }

    this.scene.addChild(brush);
    brush.blendMode = blendMode; // blendMode must be set to child node.

    this.app.renderer.render({
      container: this.scene,
      target: this.texture,
      clear: false,
    });

    this.scene.removeChild(brush);
    brush.destroy();
  }

  clearRect(rect: Rect): void {
    const clearGraphics = new Graphics()
      .rect(rect.x, rect.y, rect.width, rect.height)
      .fill(0xffffff);

    this.scene.addChild(clearGraphics);
    clearGraphics.blendMode = 'erase';

    this.app.renderer.render({
      container: this.scene,
      target: this.texture,
      clear: false,
    });

    this.scene.removeChild(clearGraphics);
    clearGraphics.destroy();
  }
}
