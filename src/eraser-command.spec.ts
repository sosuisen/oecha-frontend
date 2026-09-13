import { describe, it, expectTypeOf } from 'vitest';
import { EraserCommand } from './eraser-command';
import { DrawCommand } from './draw-command';

// EraserCommand のテスト
describe('EraserCommand', () => {
  // DrawCommandを実装するEraserCommandを生成できる
  it('can create an EraserCommand that implements DrawCommand', () => {
    const eraserCommand = new EraserCommand();
    expectTypeOf(eraserCommand).toExtend<DrawCommand>();
  });
});
