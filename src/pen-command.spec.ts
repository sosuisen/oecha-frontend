import { describe, it, expect, beforeEach } from 'vitest';
import { PenCommand } from './pen-command';
import { EventRouter } from './event-router';

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
describe('PenCommand', () => {
  let penCommand: PenCommand;
  let eventRouter: EventRouter;
  let canvas: HTMLCanvasElement;

  beforeEach(() => {
    canvas = document.createElement('canvas');
    canvas.width = 800;
    canvas.height = 600;
    eventRouter = new EventRouter(canvas);
    penCommand = new PenCommand();
  });

  // PenCommandクラスは点列を記録する
  it('records the point sequence', () => {
    expect(penCommand.getPoints()).toBeInstanceOf(Array);
  });

  // マウスダウン、ドラッグ、マウスアップで、点列がストロークコマンドに記録されることを確認する
  it('records the point sequence correctly when the mouse is dragged', () => {
    const stroke = [
      { x: 0, y: 0 },
      { x: 1, y: 1 },
      { x: 2, y: 2 },
      { x: 3, y: 3 },
    ];
    dispatchStrokeEvent(canvas, stroke);
    const command = eventRouter.getCurrentCommand();
    expect(command).toBeInstanceOf(PenCommand);
    if (command instanceof PenCommand) {
      expect(command.getPoints().length).toBe(stroke.length);
    }
  });

  // ストロークごとに異なる点列が記録される。
  it('records different point sequences for each stroke', async () => {
    const stroke1 = [
      { x: 0, y: 0 },
      { x: 1, y: 1 },
      { x: 2, y: 2 },
      { x: 3, y: 3 },
    ];
    dispatchStrokeEvent(canvas, stroke1);
    const command1 = eventRouter.getCurrentCommand();
    expect(command1).toBeInstanceOf(PenCommand);
    if (command1 instanceof PenCommand) {
      expect(command1.getPoints().length).toBe(stroke1.length);
      expect(command1.getPoints()[0]).toEqual(stroke1[0]);
    }

    const stroke2 = [
      { x: 10, y: 10 },
      { x: 11, y: 11 },
      { x: 12, y: 12 },
    ];
    dispatchStrokeEvent(canvas, stroke2);
    const command2 = eventRouter.getCurrentCommand();
    expect(command2).toBeInstanceOf(PenCommand);
    if (command2 instanceof PenCommand) {
      expect(command2.getPoints().length).toBe(stroke2.length);
      expect(command2.getPoints()[0]).toEqual(stroke2[0]);
    }
  });
});
