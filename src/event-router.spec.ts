import { describe, it, expect, beforeEach } from 'vitest';
import { EventRouter } from './event-router';
import { Tool } from './tool';
import { PenCommand } from './pen-command';

interface Point {
  x: number;
  y: number;
}

// canvas に対して pointerdown → pointermove... → pointerup を順に発火し、1 ストロークを再現する
function dispatchStrokeEvent(canvas: HTMLCanvasElement, stroke: Point[]): void {
  canvas.dispatchEvent(
    new PointerEvent('pointerdown', {
      clientX: stroke[0].x,
      clientY: stroke[0].y,
    }),
  );
  stroke.slice(1).forEach(point => {
    canvas.dispatchEvent(
      new PointerEvent('pointermove', {
        clientX: point.x,
        clientY: point.y,
      }),
    );
  });
  const last = stroke[stroke.length - 1];
  canvas.dispatchEvent(
    new PointerEvent('pointerup', { clientX: last.x, clientY: last.y }),
  );
}

// EventRouter はツールの選択状態を持ち、ポインターイベントをコマンドへ振り分ける
describe('EventRouter', () => {
  let canvas: HTMLCanvasElement;
  let eventRouter: EventRouter;

  beforeEach(() => {
    canvas = document.createElement('canvas');
    canvas.width = 800;
    canvas.height = 600;
    eventRouter = new EventRouter(canvas);
  });

  // ツールの選択
  describe('tool selection', () => {
    // 初期状態ではペンツールが選択されている
    it('selects the pen tool by default', () => {
      expect(eventRouter.getCurrentTool()).toBe(Tool.Pen);
    });

    // 消しゴムツールに切り替えられる
    it('switches to the eraser tool', () => {
      eventRouter.setCurrentTool(Tool.Eraser);
      expect(eventRouter.getCurrentTool()).toBe(Tool.Eraser);
    });

    // 消しゴムツールに切り替えた後、ペンツールに戻せる
    it('switches back to the pen tool after selecting the eraser tool', () => {
      eventRouter.setCurrentTool(Tool.Eraser);
      expect(eventRouter.getCurrentTool()).toBe(Tool.Eraser);
      eventRouter.setCurrentTool(Tool.Pen);
      expect(eventRouter.getCurrentTool()).toBe(Tool.Pen);
    });
  });

  // ペンツールでのストローク
  describe('stroke with the pen tool', () => {
    // ペンツールが選択されていると、ストロークで PenCommand が作成される
    it('creates a PenCommand for a stroke when the pen tool is selected', () => {
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

    // ドラッグすると、点列が PenCommand に記録される
    it('records the dragged points in the PenCommand', () => {
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
        expect(command.getPoints()).toEqual(stroke);
      }
    });

    // ストロークごとに異なる PenCommand が生成される
    it('creates a different PenCommand for each stroke', () => {
      const stroke1 = [
        { x: 0, y: 0 },
        { x: 1, y: 1 },
        { x: 2, y: 2 },
        { x: 3, y: 3 },
      ];
      dispatchStrokeEvent(canvas, stroke1);
      const command1 = eventRouter.getCurrentCommand();
      expect(command1).toBeInstanceOf(PenCommand);

      const stroke2 = [
        { x: 10, y: 10 },
        { x: 11, y: 11 },
        { x: 12, y: 12 },
      ];
      dispatchStrokeEvent(canvas, stroke2);
      const command2 = eventRouter.getCurrentCommand();
      expect(command2).toBeInstanceOf(PenCommand);

      expect(command2).not.toBe(command1);
      if (command1 instanceof PenCommand && command2 instanceof PenCommand) {
        expect(command1.getPoints()).toEqual(stroke1);
        expect(command2.getPoints()).toEqual(stroke2);
      }
    });

    // ポインターを離すと、ストロークがレイヤーに描かれる（離す前は描かれていない）
    it('draws the stroke on the layer when the pointer is released', () => {
      canvas.dispatchEvent(
        new PointerEvent('pointerdown', { clientX: 0, clientY: 0 }),
      );
      canvas.dispatchEvent(
        new PointerEvent('pointermove', { clientX: 3, clientY: 3 }),
      );
      const command = eventRouter.getCurrentCommand();
      expect(command).toBeInstanceOf(PenCommand);
      if (!(command instanceof PenCommand)) {
        return;
      }
      const graphics = command.getTargetLayer().getGraphics();
      expect(graphics.getBounds().width).toBe(0);

      canvas.dispatchEvent(
        new PointerEvent('pointerup', { clientX: 3, clientY: 3 }),
      );
      expect(graphics.getBounds().width).toBeGreaterThan(0);
      expect(graphics.getBounds().height).toBeGreaterThan(0);
    });
  });
});
