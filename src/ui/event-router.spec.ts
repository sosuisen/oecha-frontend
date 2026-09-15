import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { EventRouter } from './event-router';
import { ToolId } from '../tool/tool-id';
import { PenCommand } from '../command/pen-command';
import { EraserCommand } from '../command/eraser-command';
import { DrawLineOnCanvas } from '../testing/draw-line-on-canvas';
import { ToolState } from '../tool/tool-state';
import { BrushCursor } from './brush-cursor';
import { Container } from 'pixi.js';

interface Point {
  x: number;
  y: number;
}

function createBrushCursor(): BrushCursor {
  const container = new Container();
  return new BrushCursor(container, new ToolState());
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

const routers: EventRouter[] = [];

function createEventRouter(
  canvas: HTMLCanvasElement,
  toolState: ToolState = new ToolState(),
  brushCursor: BrushCursor = createBrushCursor(),
): EventRouter {
  const router = new EventRouter(
    canvas,
    new DrawLineOnCanvas(canvas),
    toolState,
    brushCursor,
  );
  routers.push(router);
  return router;
}

// EventRouter はツールの選択状態を持ち、ポインターイベントをコマンドへ振り分ける
describe('EventRouter', () => {
  let canvas: HTMLCanvasElement;
  let eventRouter: EventRouter;

  beforeEach(() => {
    canvas = document.createElement('canvas');
    canvas.width = 800;
    canvas.height = 600;
    eventRouter = createEventRouter(canvas);
  });

  afterEach(() => {
    routers.forEach(router => router.destroy());
    routers.length = 0;
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
      createEventRouter(c, toolState);
      let invoked = false;
      toolState.on('change', () => (invoked = true));
      const xKeyEvent = new KeyboardEvent('keydown', { key: 'x' });
      window.dispatchEvent(xKeyEvent);
      expect(invoked).toBe(true);
    });
  });

  // ツールの設定変更
  describe('tool settings', () => {
    // ペンツールでマウスホイールをScrollDownすると、ツールのサイズが増加する
    it('increases the pen tool size when the mouse wheel is scrolled down', () => {
      const c = document.createElement('canvas');
      const toolState = new ToolState();
      toolState.set(ToolId.Pen);
      createEventRouter(c, toolState);
      const initialSize = toolState.getCurrentTool().sizeSettings.get();
      const wheelEvent = new WheelEvent('wheel', { deltaY: 100 });
      c.dispatchEvent(wheelEvent);
      const newSize = toolState.getCurrentTool().sizeSettings.get();
      expect(newSize).toBeGreaterThan(initialSize);
    });

    // ペンツールでマウスホイールをScrollUpすると、ツールのサイズが減少する
    it('decreases the pen tool size when the mouse wheel is scrolled up', () => {
      const c = document.createElement('canvas');
      const toolState = new ToolState();
      toolState.set(ToolId.Pen);
      createEventRouter(c, toolState);
      const initialSize = toolState.getCurrentTool().sizeSettings.get();
      const wheelEvent = new WheelEvent('wheel', { deltaY: -100 });
      c.dispatchEvent(wheelEvent);
      const newSize = toolState.getCurrentTool().sizeSettings.get();
      expect(newSize).toBeLessThan(initialSize);
    });

    // 消しゴムツールでマウスホイールをScrollDownすると、ツールのサイズが増加する
    it('increases the eraser tool size when the mouse wheel is scrolled down', () => {
      const c = document.createElement('canvas');
      const toolState = new ToolState();
      toolState.set(ToolId.Eraser);
      createEventRouter(c, toolState);
      const initialSize = toolState.getCurrentTool().sizeSettings.get();
      const wheelEvent = new WheelEvent('wheel', { deltaY: 100 });
      c.dispatchEvent(wheelEvent);
      const newSize = toolState.getCurrentTool().sizeSettings.get();
      expect(newSize).toBeGreaterThan(initialSize);
    });

    // 消しゴムツールでマウスホイールをScrollUpすると、ツールのサイズが減少する
    it('decreases the eraser tool size when the mouse wheel is scrolled up', () => {
      const c = document.createElement('canvas');
      const toolState = new ToolState();
      toolState.set(ToolId.Eraser);
      createEventRouter(c, toolState);
      const initialSize = toolState.getCurrentTool().sizeSettings.get();
      const wheelEvent = new WheelEvent('wheel', { deltaY: -100 });
      c.dispatchEvent(wheelEvent);
      const newSize = toolState.getCurrentTool().sizeSettings.get();
      expect(newSize).toBeLessThan(initialSize);
    });
  });

  // ペンツールでのストローク
  describe('stroke with the pen tool', () => {
    // ペンツールが選択されていると、pointerdownイベントで PenCommand が作成される
    it('creates a PenCommand for each pointerdown event when the pen tool is selected', () => {
      const c = document.createElement('canvas');
      const toolState = new ToolState();
      toolState.set(ToolId.Pen);
      const router = createEventRouter(c, toolState);
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
      const router = createEventRouter(c, toolState);
      c.dispatchEvent(createPointerEvent('pointerdown', { x: 0, y: 0 }));
      expect(router.getCurrentCommand()).toBeInstanceOf(EraserCommand);
    });
  });

  // 全画面消去
  describe('clear screen', () => {
    // Deleteキーを押すと、レイヤーの全画面が消去される
    it('clears the entire layer when the Delete key is pressed', () => {
      const c = document.createElement('canvas');
      const ctx = c.getContext('2d')!;
      ctx.canvas.width = 100;
      ctx.canvas.height = 100;
      ctx.fillStyle = 'red';
      ctx.fillRect(0, 0, 100, 100);

      const toolState = new ToolState();

      createEventRouter(c, toolState);

      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Delete' }));

      const imageData = ctx.getImageData(0, 0, 1, 1);
      const [, , , a1] = imageData.data;
      expect(a1).toBe(0);

      const imageData2 = ctx.getImageData(50, 50, 1, 1);
      const [, , , a2] = imageData2.data;
      expect(a2).toBe(0);

      const imageData3 = ctx.getImageData(99, 99, 1, 1);
      const [, , , a3] = imageData3.data;
      expect(a3).toBe(0);
    });
  });

  // カーソル
  describe('cursor', () => {
    // 描画ツールのときにマウスカーソルを動かすと、ブラシカーソルが追従する
    it('updates the brush cursor position when the mouse is moved with the pen tool selected', () => {
      const c = document.createElement('canvas');
      const toolState = new ToolState();
      toolState.set(ToolId.Pen);

      const brushCursor = new BrushCursor(new Container(), toolState);

      const router = createEventRouter(c, toolState, brushCursor);
      c.dispatchEvent(createPointerEvent('pointermove', { x: 100, y: 200 }));
      const lastPoint = router.getLastPoint();

      expect(lastPoint).toEqual({
        x: brushCursor.getX(),
        y: brushCursor.getY(),
      });
    });

    // ツールのサイズを変更すると、ブラシカーソルのサイズも変化する
    it('updates the brush cursor size when the tool size is changed', () => {
      const toolState = new ToolState();
      toolState.set(ToolId.Pen);
      const brushCursor = new BrushCursor(new Container(), toolState);

      toolState.getCurrentTool().sizeSettings.set(10);
      expect(brushCursor.getSize()).toEqual({
        width: 10 + BrushCursor.LINE_WIDTH,
        height: 10 + BrushCursor.LINE_WIDTH,
      });

      toolState.getCurrentTool().sizeSettings.set(20);
      expect(brushCursor.getSize()).toEqual({
        width: 20 + BrushCursor.LINE_WIDTH,
        height: 20 + BrushCursor.LINE_WIDTH,
      });
    });
  });
});
