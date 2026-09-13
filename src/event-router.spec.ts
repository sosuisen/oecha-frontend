import { describe, it, expect, beforeEach } from 'vitest';
import { EventRouter } from './event-router';
import { Tool } from './tool';
import { PenCommand } from './pen-command';
import { EraserCommand } from './eraser-command';
import { DrawLineOnCanvas } from './testing/draw-line-on-canvas';

interface Point {
  x: number;
  y: number;
}

function createPointerEvent(type: string, point: Point): Event {
  if (typeof PointerEvent !== 'undefined') {
    return new PointerEvent(type, {
      bubbles: true,
      clientX: point.x,
      clientY: point.y,
    });
  }
  const mouseEvent = new MouseEvent(type, {
    bubbles: true,
    clientX: point.x,
    clientY: point.y,
  });
  Object.defineProperty(mouseEvent, 'pointerType', {
    value: 'mouse',
    configurable: true,
  });
  return mouseEvent;
}

// EventRouter はツールの選択状態を持ち、ポインターイベントをコマンドへ振り分ける
describe('EventRouter', () => {
  let canvas: HTMLCanvasElement;
  let eventRouter: EventRouter;

  beforeEach(() => {
    canvas = document.createElement('canvas');
    canvas.width = 800;
    canvas.height = 600;
    eventRouter = new EventRouter(canvas, new DrawLineOnCanvas(canvas));
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
    // ペンツールが選択されていると、pointerdownイベントで PenCommand が作成される
    it('creates a PenCommand for each pointerdown event when the pen tool is selected', () => {
      eventRouter.setCurrentTool(Tool.Pen);
      canvas.dispatchEvent(createPointerEvent('pointerdown', { x: 0, y: 0 }));
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
      canvas.dispatchEvent(createPointerEvent('pointerdown', stroke[0]));
      stroke.slice(1).forEach(point => {
        canvas.dispatchEvent(createPointerEvent('pointermove', point));
      });
      const command = eventRouter.getCurrentCommand();
      expect(command).toBeInstanceOf(PenCommand);
      if (command instanceof PenCommand) {
        expect(command.getPoints()).toEqual(stroke);
      }
    });

    // pointerdownイベントごとに異なる PenCommand が生成される
    it('creates a new PenCommand for each pointerdown event', () => {
      canvas.dispatchEvent(createPointerEvent('pointerdown', { x: 0, y: 0 }));
      const command1 = eventRouter.getCurrentCommand();
      expect(command1).toBeInstanceOf(PenCommand);
      canvas.dispatchEvent(createPointerEvent('pointerup', { x: 0, y: 0 }));

      canvas.dispatchEvent(createPointerEvent('pointerdown', { x: 1, y: 1 }));
      const command2 = eventRouter.getCurrentCommand();
      expect(command2).toBeInstanceOf(PenCommand);
      canvas.dispatchEvent(createPointerEvent('pointerup', { x: 1, y: 1 }));

      expect(command2).not.toBe(command1);
    });

    // ポインターをドラッグすると、ストロークがレイヤーに描かれる
    it('draws the stroke on the layer when the pointer is released', () => {
      canvas.dispatchEvent(
        new PointerEvent('pointerdown', { clientX: 0, clientY: 0 }),
      );
      canvas.dispatchEvent(
        new PointerEvent('pointermove', { clientX: 10, clientY: 10 }),
      );
      const command = eventRouter.getCurrentCommand();
      expect(command).toBeInstanceOf(PenCommand);
      if (!(command instanceof PenCommand)) {
        return;
      }
      const imageData = canvas.getContext('2d')!.getImageData(0, 0, 1, 1);
      const [r1, g1, b1] = imageData.data;
      const color1 = (r1 << 16) | (g1 << 8) | b1;
      expect(color1).toBe(PenCommand.DEFAULT_COLOR);

      const imageData2 = canvas.getContext('2d')!.getImageData(10, 10, 1, 1);
      const [r2, g2, b2] = imageData2.data;
      const color2 = (r2 << 16) | (g2 << 8) | b2;
      expect(color2).toBe(PenCommand.DEFAULT_COLOR);

      const imageData3 = canvas.getContext('2d')!.getImageData(0, 5, 1, 1);
      const [r3, g3, b3] = imageData3.data;
      const color3 = (r3 << 16) | (g3 << 8) | b3;
      expect(color3).toBe(0x000000); // no line drawn at this point
    });
  });

  // 消しゴムツールでのストローク
  describe('stroke with the eraser tool', () => {
    // 消しゴムツールが選択されていると、pointerdownイベントで EraserCommand が作成される
    it('creates an EraserCommand for each pointerdown event when the eraser tool is selected', () => {
      eventRouter.setCurrentTool(Tool.Eraser);
      canvas.dispatchEvent(createPointerEvent('pointerdown', { x: 0, y: 0 }));
      expect(eventRouter.getCurrentCommand()).toBeInstanceOf(EraserCommand);
    });
  });
});
