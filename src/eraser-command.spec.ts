import { describe, it, expect, expectTypeOf } from 'vitest';
import { EraserCommand } from './eraser-command';
import { DrawCommand } from './draw-command';
import { PenCommand } from './pen-command';
import { CanvasLayer } from './testing/canvas-layer';
import { DrawLineOnCanvas } from './testing/draw-line-on-canvas';

// EraserCommand のテスト
describe('EraserCommand', () => {
  // DrawCommandを実装するEraserCommandを生成できる
  it('can create an EraserCommand that implements DrawCommand', () => {
    const eraserCommand = new EraserCommand(
      new CanvasLayer(
        'Layer01',
        new DrawLineOnCanvas(document.createElement('canvas')),
      ),
    );
    expectTypeOf(eraserCommand).toExtend<DrawCommand>();
  });

  // drawNextSegment() は、2点間の線分で消去する
  it('draws a line segment between the last two points when drawNextSegment is called', () => {
    const canvas = document.createElement('canvas');
    const layer = new CanvasLayer('Layer01', new DrawLineOnCanvas(canvas));
    const ctx = canvas.getContext('2d')!;
    ctx.canvas.width = 20;
    ctx.canvas.height = 20;

    const penCommand = new PenCommand(layer);
    penCommand.addPoint(0, 0);
    penCommand.addPoint(10, 10);
    penCommand.execute();

    const eraserCommand = new EraserCommand(layer);
    eraserCommand.addPoint(0, 0);
    eraserCommand.addPoint(5, 5);
    eraserCommand.drawNextSegment();
    const imageData = canvas.getContext('2d')!.getImageData(0, 0, 1, 1);
    const [, , , a1] = imageData.data;
    expect(a1).toBe(0);

    const imageData2 = canvas.getContext('2d')!.getImageData(10, 10, 1, 1);
    const [, , , a2] = imageData2.data;
    expect(a2).toBe(255);
  });

  // 消しゴムのサイズをセット、ゲットできる
  it('has a size property', () => {
    const eraserCommand = new EraserCommand(
      new CanvasLayer(
        'Layer01',
        new DrawLineOnCanvas(document.createElement('canvas')),
      ),
    );
    eraserCommand.setSize(10);
    expect(eraserCommand.getSize()).toBe(10);
  });
});
