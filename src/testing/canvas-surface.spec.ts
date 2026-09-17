import { describe, it, expect } from 'vitest';
import { CanvasSurface } from './canvas-surface';

describe('CanvasSurface', () => {
  // 与えられた2点間の直線を描画できる
  it('should draw a line between two points on a canvas', () => {
    const surface = new CanvasSurface(document.createElement('canvas'));
    surface.drawLine(
      { x: 0, y: 0 },
      { x: 10, y: 10 },
      { blendMode: 'normal', color: 0xff0000, size: 1 },
    );
    const color1: number = surface.getPixel(0, 0);
    expect(color1).toBe(0xff0000);
    const color2: number = surface.getPixel(10, 10);
    expect(color2).toBe(0xff0000);
  });

  // drawLineはブレンドモードnormalを反映して描画する
  it('should draw with the specified blend mode', () => {
    const surface = new CanvasSurface(document.createElement('canvas'));
    surface.drawLine(
      { x: 0, y: 0 },
      { x: 10, y: 10 },
      { blendMode: 'normal', color: 0xff0000, size: 1 },
    );
    const color1: number = surface.getPixel(0, 0);
    expect(color1).toBe(0xff0000);
    const color2: number = surface.getPixel(10, 10);
    expect(color2).toBe(0xff0000);
  });
});
