import { describe, it, expect } from 'vitest';
import { PenCommand } from './pen-command';
import { CanvasLayer } from '../testing/canvas-layer';
import { CanvasSurface } from '../testing/canvas-surface';

// マウスドラッグで線を描く
describe('PenCommand', () => {
  // 生成直後の点列は空である
  it('starts with an empty point sequence', () => {
    const penCommand = new PenCommand(
      new CanvasLayer(
        'Layer01',
        'Layer 01',
        new CanvasSurface(document.createElement('canvas')),
      ),
    );
    expect(penCommand.getPoints()).toEqual([]);
  });

  // execute() すると、点列が描画対象のレイヤーに描かれる
  it('draws the points on the target layer when executed', () => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d')!;
    ctx.canvas.width = 20;
    ctx.canvas.height = 20;

    const stroke = [
      { x: 0, y: 0 },
      { x: 1, y: 1 },
      { x: 2, y: 2 },
    ];
    const layer = new CanvasLayer(
      'Layer01',
      'Layer 01',
      new CanvasSurface(canvas),
    );
    const penCommand = new PenCommand(layer);
    stroke.forEach(point => {
      penCommand.addPoint(point.x, point.y);
    });

    penCommand.execute();

    const imageData = canvas.getContext('2d')!.getImageData(0, 0, 1, 1);
    const [r1, g1, b1] = imageData.data;
    const color1 = (r1 << 16) | (g1 << 8) | b1;
    expect(color1).toBe(penCommand.getColor());

    const imageData2 = canvas.getContext('2d')!.getImageData(1, 1, 1, 1);
    const [r2, g2, b2] = imageData2.data;
    const color2 = (r2 << 16) | (g2 << 8) | b2;
    expect(color2).toBe(penCommand.getColor());

    const imageData3 = canvas.getContext('2d')!.getImageData(2, 2, 1, 1);
    const [r3, g3, b3] = imageData3.data;
    const color3 = (r3 << 16) | (g3 << 8) | b3;
    expect(color3).toBe(penCommand.getColor());
  });

  // drawNextSegment() は、2点間の線分を描画する
  it('draws a line segment between the last two points when drawNextSegment is called', () => {
    const canvas = document.createElement('canvas');
    const layer = new CanvasLayer(
      'Layer01',
      'Layer 01',
      new CanvasSurface(canvas),
    );
    const ctx = canvas.getContext('2d')!;
    ctx.canvas.width = 20;
    ctx.canvas.height = 20;

    const penCommand = new PenCommand(layer);
    penCommand.addPoint(0, 0);
    penCommand.addPoint(10, 10);
    penCommand.drawNextSegment();
    const imageData = canvas.getContext('2d')!.getImageData(0, 0, 1, 1);
    const [r1, g1, b1] = imageData.data;
    const color1 = (r1 << 16) | (g1 << 8) | b1;
    expect(color1).toBe(penCommand.getColor());

    const imageData2 = canvas.getContext('2d')!.getImageData(10, 10, 1, 1);
    const [r2, g2, b2] = imageData2.data;
    const color2 = (r2 << 16) | (g2 << 8) | b2;
    expect(color2).toBe(penCommand.getColor());

    const imageData3 = canvas.getContext('2d')!.getImageData(0, 5, 1, 1);
    const [r3, g3, b3] = imageData3.data;
    const color3 = (r3 << 16) | (g3 << 8) | b3;
    expect(color3).toBe(0x000000); // no line drawn at this point
  });

  // 始点と終点が同じ場合は点が描画される
  it('draws a point when the start and end points are the same', () => {
    const canvas = document.createElement('canvas');
    const layer = new CanvasLayer(
      'Layer01',
      'Layer 01',
      new CanvasSurface(canvas),
    );
    const ctx = canvas.getContext('2d')!;
    ctx.canvas.width = 20;
    ctx.canvas.height = 20;

    const penCommand = new PenCommand(layer);
    penCommand.addPoint(5, 5);
    penCommand.addPoint(5, 5);
    penCommand.drawNextSegment();

    const imageData = canvas.getContext('2d')!.getImageData(5, 5, 1, 1);
    const [r, g, b] = imageData.data;
    const color = (r << 16) | (g << 8) | b;
    expect(color).toBe(penCommand.getColor());
  });

  // ペンのサイズをセット、ゲットできる
  it('has a size property', () => {
    const penCommand = new PenCommand(
      new CanvasLayer(
        'Layer01',
        'Layer 01',
        new CanvasSurface(document.createElement('canvas')),
      ),
    );
    penCommand.setSize(10);
    expect(penCommand.getSize()).toBe(10);
  });

  // ペンの色をセット、ゲットできる
  it('has a color property', () => {
    const penCommand = new PenCommand(
      new CanvasLayer(
        'Layer01',
        'Layer 01',
        new CanvasSurface(document.createElement('canvas')),
      ),
    );
    penCommand.setColor(0xff0000);
    expect(penCommand.getColor()).toBe(0xff0000);
  });
});
