import { describe, it, expectTypeOf } from 'vitest';
import { EraserCommand } from './eraser-command';
import { DrawCommand } from './draw-command';
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
});
