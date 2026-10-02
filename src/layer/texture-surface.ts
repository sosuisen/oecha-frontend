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

  /**
   * Gets the color of the pixel at the specified coordinates.
   * @param x - The x-coordinate. Fractions are dropped.
   * @param y - The y-coordinate. Fractions are dropped.
   * @returns The color as 0xRRGGBB, or null when the point is outside the
   * texture or nothing is drawn there.
   */
  getColorAt(x: number, y: number): number | null {
    const { pixels, width, height } = this.app.renderer.extract.pixels(
      this.texture,
    );
    // Pointer coordinates can be fractional. A fractional index reads
    // undefined from the pixel array, which would look like black.
    const px = Math.floor(x);
    const py = Math.floor(y);
    if (px < 0 || px >= width || py < 0 || py >= height) {
      return null;
    }

    const index = (py * width + px) * 4;
    const r = pixels[index];
    const g = pixels[index + 1];
    const b = pixels[index + 2];
    const a = pixels[index + 3];
    if (a === 0) {
      return null; // nothing is drawn here
    }
    return (r << 16) | (g << 8) | b;
  }
}
