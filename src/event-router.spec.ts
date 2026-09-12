import { describe, it, expect, beforeEach } from 'vitest';
import { EventRouter } from './event-router';
import { Tool } from './tool';
import { PenCommand } from './pen-command';

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

// Event Routerのテスト
describe('Event Router', () => {
  let canvas: HTMLCanvasElement;
  let eventRouter: EventRouter;

  beforeEach(() => {
    canvas = document.createElement('canvas');
    eventRouter = new EventRouter(canvas);
  });

  // Event Routerのインスタンスを作成できる
  it('creates an Event Router instance', () => {
    expect(eventRouter).toBeDefined();
  });

  // ペンツールが選択されている。
  it('routes stroke events correctly', () => {
    expect(eventRouter.getCurrentTool()).toBe(Tool.Pen);
  });

  // 消しゴムツールを選択できる
  it('can select the eraser tool', () => {
    eventRouter.setCurrentTool(Tool.Eraser);
    expect(eventRouter.getCurrentTool()).toBe(Tool.Eraser);
  });

  // 消しゴムツールを選択した後、ペンツールに戻すことができる
  it('can switch back to the pen tool after selecting the eraser tool', () => {
    eventRouter.setCurrentTool(Tool.Eraser);
    expect(eventRouter.getCurrentTool()).toBe(Tool.Eraser);
    eventRouter.setCurrentTool(Tool.Pen);
    expect(eventRouter.getCurrentTool()).toBe(Tool.Pen);
  });

  // ペンツールが選択されていると、マウスのストロークでPenCommandオブジェクトが作成される
  it('creates a PenCommand object when the pen tool is selected', () => {
    eventRouter.setCurrentTool(Tool.Pen);
    const stroke = [
      { x: 0, y: 0 },
      { x: 1, y: 1 },
      { x: 2, y: 2 },
      { x: 3, y: 3 },
    ];
    dispatchStrokeEvent(canvas, stroke);
    expect(eventRouter.getCurrentCommand()).toBeInstanceOf(PenCommand);
  });
});
