import { describe, it, expect, beforeEach } from 'vitest';
import { EventRouter } from './event-router';
import { ToolId } from './tool-id';
import { PenCommand } from './pen-command';
import { EraserCommand } from './eraser-command';
import { DrawLineOnCanvas } from './testing/draw-line-on-canvas';
import { ToolState } from './tool-state';

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
    eventRouter = new EventRouter(
      canvas,
      new DrawLineOnCanvas(canvas),
      new ToolState(),
    );
  });

  // ツールの選択
  describe('tool selection', () => {
    // Xキーを押すたびに、ペンツールと消しゴムツールがトグルする。
    it('toggles between the pen and eraser tools when the X key is pressed', () => {
      expect(eventRouter.getCurrentTool()).toBe(ToolId.Pen);
      const xKeyEvent = new KeyboardEvent('keydown', { key: 'x' });
      window.dispatchEvent(xKeyEvent);
      expect(eventRouter.getCurrentTool()).toBe(ToolId.Eraser);
      window.dispatchEvent(xKeyEvent);
      expect(eventRouter.getCurrentTool()).toBe(ToolId.Pen);
    });

    // ツールをトグルすると、ToolStateのchangeイベントが発火する
    it('emits a change event when the tool is switched', () => {
      const c = document.createElement('canvas');
      const toolState = new ToolState();
      new EventRouter(c, new DrawLineOnCanvas(c), toolState);
      let invoked = false;
      toolState.on('change', () => (invoked = true));
      const xKeyEvent = new KeyboardEvent('keydown', { key: 'x' });
      window.dispatchEvent(xKeyEvent);
      expect(invoked).toBe(true);
    });
  });

  // ペンツールでのストローク
  describe('stroke with the pen tool', () => {
    // ペンツールが選択されていると、pointerdownイベントで PenCommand が作成される
    it('creates a PenCommand for each pointerdown event when the pen tool is selected', () => {
      const c = document.createElement('canvas');
      const toolState = new ToolState();
      toolState.set(ToolId.Pen);
      new EventRouter(c, new DrawLineOnCanvas(c), toolState);
      const router = new EventRouter(c, new DrawLineOnCanvas(c), toolState);
      c.dispatchEvent(createPointerEvent('pointerdown', { x: 0, y: 0 }));
      expect(router.getCurrentCommand()).toBeInstanceOf(PenCommand);
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
      const c = document.createElement('canvas');
      const toolState = new ToolState();
      toolState.set(ToolId.Eraser);
      new EventRouter(c, new DrawLineOnCanvas(c), toolState);
      const router = new EventRouter(c, new DrawLineOnCanvas(c), toolState);
      c.dispatchEvent(createPointerEvent('pointerdown', { x: 0, y: 0 }));
      expect(router.getCurrentCommand()).toBeInstanceOf(EraserCommand);
    });
  });
});
