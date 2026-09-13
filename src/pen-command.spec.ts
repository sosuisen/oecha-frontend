import { describe, it, expect } from 'vitest';
import { PenCommand } from './pen-command';
import { Layer } from './layer';

// マウスドラッグで線を描く
describe('PenCommand', () => {
  // 生成直後の点列は空である
  it('starts with an empty point sequence', () => {
    const penCommand = new PenCommand(new Layer('Layer01'));
    expect(penCommand.getPoints()).toEqual([]);
  });

  // コンストラクタで渡したレイヤーを描画対象として返す
  it('returns the layer given to the constructor as the target', () => {
    const layer = new Layer('Layer01');
    const penCommand = new PenCommand(layer);
    expect(penCommand.getTargetLayer()).toBe(layer);
  });

  // execute() すると、点列が描画対象のレイヤーに描かれる
  it('draws the points on the target layer when executed', () => {
    const stroke = [
      { x: 0, y: 0 },
      { x: 1, y: 1 },
      { x: 2, y: 2 },
      { x: 3, y: 3 },
    ];
    const layer = new Layer('Layer01');
    const penCommand = new PenCommand(layer);
    stroke.forEach(point => {
      penCommand.addPoint(point.x, point.y);
    });
    penCommand.execute();
    expect(layer.getGraphics().getBounds().width).toBeGreaterThan(0);
    expect(layer.getGraphics().getBounds().height).toBeGreaterThan(0);
  });

  // drawNextSegment() は、2点間の線分を描画する
  it('draws a line segment between the last two points when drawNextSegment is called', () => {
    const layer = new Layer('Layer01');
    const penCommand = new PenCommand(layer);
    penCommand.addPoint(0, 0);
    penCommand.addPoint(10, 10);
    penCommand.drawNextSegment();
    expect(layer.getGraphics().getBounds().width).toBeGreaterThan(0);
    expect(layer.getGraphics().getBounds().height).toBeGreaterThan(0);
  });
});
