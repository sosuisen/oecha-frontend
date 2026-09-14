import { DrawLine, DrawOptions } from './draw-line';
import {
  Application,
  Container,
  RenderTexture,
  Graphics,
  BLEND_MODES,
  PointData,
} from 'pixi.js';

export class DrawLineOnTexture implements DrawLine {
  private readonly app: Application;
  private readonly texture: RenderTexture;

  // renderer.render() ignores the blendMode of the container it receives,
  // so the brush is drawn as a child of this parent.
  private readonly scene = new Container();

  constructor(app: Application, texture: RenderTexture) {
    this.app = app;
    this.texture = texture;
  }

  draw(p1: PointData, p2: PointData, drawOptions: DrawOptions): void {
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
}
