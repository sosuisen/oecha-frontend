import { describe, it, expect } from 'vitest';
import { ClearCommand } from './clear-command';
import { CanvasLayer } from '../testing/canvas-layer';
import { DrawLineOnCanvas } from '../testing/draw-line-on-canvas';

// 矩形を消去するコマンドのテスト
describe('ClearCommand', () => {
  // 指定した範囲を消去する
  it('should clear the specified area', () => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d')!;
    ctx.canvas.width = 100;
    ctx.canvas.height = 100;
    ctx.fillStyle = 'red';
    ctx.fillRect(0, 0, 100, 100);

    const layer = new CanvasLayer('Layer01', new DrawLineOnCanvas(canvas));
    const clearCommand = new ClearCommand(layer, {
      x: 10,
      y: 10,
      width: 80,
      height: 80,
    });
    clearCommand.execute();

    const imageData = canvas.getContext('2d')!.getImageData(9, 9, 1, 1);
    const [, , , a1] = imageData.data;
    expect(a1).toBe(255);

    const imageData2 = canvas.getContext('2d')!.getImageData(10, 10, 1, 1);
    const [, , , a2] = imageData2.data;
    expect(a2).toBe(0);

    const imageData3 = canvas.getContext('2d')!.getImageData(89, 89, 1, 1);
    const [, , , a3] = imageData3.data;
    expect(a3).toBe(0);

    const imageData4 = canvas.getContext('2d')!.getImageData(90, 90, 1, 1);
    const [, , , a4] = imageData4.data;
    expect(a4).toBe(255);
  });
});
