import { describe, it, expect, beforeEach } from 'vitest';
import { StrokeInput } from './stroke-input';

function dispatchStrokeEvent(
  canvas: HTMLCanvasElement,
  stroke: { x: number; y: number }[],
) {
  const downEvent = new PointerEvent('pointerdown', {
    clientX: stroke[0].x,
    clientY: stroke[0].y,
  });
  canvas.dispatchEvent(downEvent);
  stroke.slice(1).forEach(point => {
    const moveEvent = new PointerEvent('pointermove', {
      clientX: point.x,
      clientY: point.y,
    });
    canvas.dispatchEvent(moveEvent);
  });
  const upEvent = new PointerEvent('pointerup', {
    clientX: stroke[stroke.length - 1].x,
    clientY: stroke[stroke.length - 1].y,
  });
  canvas.dispatchEvent(upEvent);
}

// マウスドラッグで線を描く
describe('StrokeInput', () => {
  let strokeInput: StrokeInput;
  let canvas: HTMLCanvasElement;

  beforeEach(() => {
    canvas = document.createElement('canvas');
    canvas.width = 800;
    canvas.height = 600;
    strokeInput = new StrokeInput(canvas);
  });

  // StrokeInputクラスのインスタンスを作成できる
  it('creates a StrokeInput instance', () => {
    expect(strokeInput).toBeInstanceOf(StrokeInput);
  });

  // StrokeInputクラスは点列を記録する
  it('records the point sequence', () => {
    expect(strokeInput.getPoints()).toBeInstanceOf(Array);
  });

  // マウスダウン、ドラッグ、マウスアップで、点列が正しく記録されることを確認する
  it('records the point sequence correctly when the mouse is dragged', () => {
    const stroke = [
      { x: 0, y: 0 },
      { x: 1, y: 1 },
      { x: 2, y: 2 },
      { x: 3, y: 3 },
    ];
    dispatchStrokeEvent(canvas, stroke);
    expect(strokeInput.getPoints().length).toBe(stroke.length);
  });

  // ストロークごとに異なる点列が記録される。
  it.todo('records different point sequences for each stroke', async () => {});
});
