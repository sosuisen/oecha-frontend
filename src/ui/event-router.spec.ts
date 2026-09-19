import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { EventRouter } from './event-router';
import { ToolId } from '../tool/tool-id';
import { PenCommand } from '../command/pen-command';
import { EraserCommand } from '../command/eraser-command';
import { CanvasLayerStack } from '../testing/canvas-layer-stack';
import { ToolState } from '../tool/tool-state';
import { BrushCursor } from './brush-cursor';
import { Container } from 'pixi.js';

interface Point {
  x: number;
  y: number;
}

function createBrushCursor(layerStack: CanvasLayerStack): BrushCursor {
  const container = new Container();
  return new BrushCursor(container, new ToolState(layerStack));
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
  layerStack: CanvasLayerStack = new CanvasLayerStack(),
  toolState: ToolState = new ToolState(layerStack),
  brushCursor: BrushCursor = createBrushCursor(layerStack),
): EventRouter {
  const router = new EventRouter(canvas, layerStack, toolState, brushCursor);
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

      const XKeyEvent = new KeyboardEvent('keydown', { key: 'X' });
      window.dispatchEvent(XKeyEvent);
      expect(eventRouter.getCurrentTool()).toBe(ToolId.Eraser);
      window.dispatchEvent(XKeyEvent);
      expect(eventRouter.getCurrentTool()).toBe(ToolId.Pen);
    });

    // ツールをトグルすると、ToolStateのchangeイベントが発火する
    it('emits a change event when the tool is switched', () => {
      const c = document.createElement('canvas');
      const layerStack = new CanvasLayerStack();
      const toolState = new ToolState(layerStack);
      createEventRouter(c, layerStack, toolState);
      let invoked = false;
      toolState.on('change', () => (invoked = true));
      const xKeyEvent = new KeyboardEvent('keydown', { key: 'x' });
      window.dispatchEvent(xKeyEvent);
      expect(invoked).toBe(true);
    });

    // Pキーを押すと、ペンツールが選択される
    it('selects the pen tool when the P key is pressed', () => {
      const c = document.createElement('canvas');
      const layerStack = new CanvasLayerStack();
      const toolState = new ToolState(layerStack);
      toolState.set(ToolId.Eraser);
      const router = createEventRouter(c, layerStack, toolState);

      const pKeyEvent = new KeyboardEvent('keydown', { key: 'p' });
      window.dispatchEvent(pKeyEvent);
      expect(router.getCurrentTool()).toBe(ToolId.Pen);

      toolState.set(ToolId.Eraser);
      const PKeyEvent = new KeyboardEvent('keydown', { key: 'P' });
      window.dispatchEvent(PKeyEvent);
      expect(router.getCurrentTool()).toBe(ToolId.Pen);
    });

    // Eキーを押すと、消しゴムツールが選択される
    it('selects the eraser tool when the E key is pressed', () => {
      const c = document.createElement('canvas');
      const layerStack = new CanvasLayerStack();
      const toolState = new ToolState(layerStack);
      toolState.set(ToolId.Pen);
      const router = createEventRouter(c, layerStack, toolState);

      const eKeyEvent = new KeyboardEvent('keydown', { key: 'e' });
      window.dispatchEvent(eKeyEvent);
      expect(router.getCurrentTool()).toBe(ToolId.Eraser);

      toolState.set(ToolId.Pen);
      const EKeyEvent = new KeyboardEvent('keydown', { key: 'E' });
      window.dispatchEvent(EKeyEvent);
      expect(router.getCurrentTool()).toBe(ToolId.Eraser);
    });
  });

  // ツールの設定変更
  describe('tool settings', () => {
    // ペンツールでマウスホイールをScrollUpすると、ツールのサイズが増加する
    it('increases the pen tool size when the mouse wheel is scrolled up', () => {
      const c = document.createElement('canvas');
      const layerStack = new CanvasLayerStack();
      const toolState = new ToolState(layerStack);
      toolState.set(ToolId.Pen);
      createEventRouter(c, layerStack, toolState);
      const initialSize = toolState.getCurrentTool().sizeSettings.get();
      const wheelEvent = new WheelEvent('wheel', { deltaY: -100 });
      c.dispatchEvent(wheelEvent);
      const newSize = toolState.getCurrentTool().sizeSettings.get();
      expect(newSize).toBeGreaterThan(initialSize);
    });

    // ペンツールでマウスホイールをScrollDownすると、ツールのサイズが減少する
    it('decreases the pen tool size when the mouse wheel is scrolled down', () => {
      const c = document.createElement('canvas');
      const layerStack = new CanvasLayerStack();
      const toolState = new ToolState(layerStack);
      toolState.set(ToolId.Pen);
      createEventRouter(c, layerStack, toolState);
      const initialSize = toolState.getCurrentTool().sizeSettings.get();
      const wheelEvent = new WheelEvent('wheel', { deltaY: 100 });
      c.dispatchEvent(wheelEvent);
      const newSize = toolState.getCurrentTool().sizeSettings.get();
      expect(newSize).toBeLessThan(initialSize);
    });

    // 消しゴムツールでマウスホイールをScrollUpすると、ツールのサイズが増加する
    it('increases the eraser tool size when the mouse wheel is scrolled up', () => {
      const c = document.createElement('canvas');
      const layerStack = new CanvasLayerStack();
      const toolState = new ToolState(layerStack);
      toolState.set(ToolId.Eraser);
      createEventRouter(c, layerStack, toolState);
      const initialSize = toolState.getCurrentTool().sizeSettings.get();
      const wheelEvent = new WheelEvent('wheel', { deltaY: -100 });
      c.dispatchEvent(wheelEvent);
      const newSize = toolState.getCurrentTool().sizeSettings.get();
      expect(newSize).toBeGreaterThan(initialSize);
    });

    // 消しゴムツールでマウスホイールをScrollDownすると、ツールのサイズが減少する
    it('decreases the eraser tool size when the mouse wheel is scrolled down', () => {
      const c = document.createElement('canvas');
      const layerStack = new CanvasLayerStack();
      const toolState = new ToolState(layerStack);
      toolState.set(ToolId.Eraser);
      createEventRouter(c, layerStack, toolState);
      const initialSize = toolState.getCurrentTool().sizeSettings.get();
      const wheelEvent = new WheelEvent('wheel', { deltaY: 100 });
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
      const layerStack = new CanvasLayerStack();
      const toolState = new ToolState(layerStack);
      toolState.set(ToolId.Pen);
      const router = createEventRouter(c, layerStack, toolState);
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
      const baseCanvas = document.createElement('canvas');
      const layerCanvas = document.createElement('canvas');
      const layerStack = new CanvasLayerStack([
        layerCanvas,
        document.createElement('canvas'),
      ]);
      const router = createEventRouter(
        baseCanvas,
        layerStack,
        new ToolState(layerStack),
        createBrushCursor(layerStack),
      );
      const ctx = layerCanvas.getContext('2d')!;

      baseCanvas.dispatchEvent(
        new PointerEvent('pointerdown', { clientX: 0, clientY: 0 }),
      );
      baseCanvas.dispatchEvent(
        new PointerEvent('pointermove', { clientX: 10, clientY: 10 }),
      );
      const command = router.getCurrentCommand();
      expect(command).toBeInstanceOf(PenCommand);
      if (!(command instanceof PenCommand)) {
        return;
      }
      const imageData = ctx.getImageData(0, 0, 1, 1);
      const [r1, g1, b1] = imageData.data;
      const color1 = (r1 << 16) | (g1 << 8) | b1;
      expect(color1).toBe(command.getColor());

      const imageData2 = ctx.getImageData(10, 10, 1, 1);
      const [r2, g2, b2] = imageData2.data;
      const color2 = (r2 << 16) | (g2 << 8) | b2;
      expect(color2).toBe(command.getColor());

      const imageData3 = ctx.getImageData(0, 5, 1, 1);
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
      const layerStack = new CanvasLayerStack();
      const toolState = new ToolState(layerStack);
      toolState.set(ToolId.Eraser);
      const router = createEventRouter(c, layerStack, toolState);
      c.dispatchEvent(createPointerEvent('pointerdown', { x: 0, y: 0 }));
      expect(router.getCurrentCommand()).toBeInstanceOf(EraserCommand);
    });
  });

  // 全画面消去
  describe('clear screen', () => {
    // Deleteキーを押すと、レイヤーの全画面が消去される
    it('clears the entire layer when the Delete key is pressed', () => {
      const baseCanvas = document.createElement('canvas');
      const layerCanvas = document.createElement('canvas');
      const layerStack = new CanvasLayerStack([
        layerCanvas,
        document.createElement('canvas'),
      ]);
      createEventRouter(
        baseCanvas,
        layerStack,
        new ToolState(layerStack),
        createBrushCursor(layerStack),
      );
      const ctx = layerCanvas.getContext('2d')!;
      ctx.canvas.width = 100;
      ctx.canvas.height = 100;
      ctx.fillStyle = 'red';
      ctx.fillRect(0, 0, 100, 100);

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
      const layerStack = new CanvasLayerStack();
      const toolState = new ToolState(layerStack);
      toolState.set(ToolId.Pen);

      const brushCursor = new BrushCursor(new Container(), toolState);

      const router = createEventRouter(c, layerStack, toolState, brushCursor);
      c.dispatchEvent(createPointerEvent('pointermove', { x: 100, y: 200 }));
      const lastPoint = router.getLastPoint();

      expect(lastPoint).toEqual({
        x: brushCursor.getX(),
        y: brushCursor.getY(),
      });
    });

    // ツールのサイズを変更すると、ブラシカーソルのサイズも変化する
    it('updates the brush cursor size when the tool size is changed', () => {
      const layerStack = new CanvasLayerStack();
      const toolState = new ToolState(layerStack);
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

  // レイヤーの選択
  describe('layer selection', () => {
    // 2キーを押すと2枚目のレイヤーが、1キーを押すと1枚目のレイヤーが現在のレイヤーになる
    it('selects the second layer with the 2 key and the first layer with the 1 key', () => {
      expect(eventRouter.getCurrentLayer().id).toBe('Layer01');

      window.dispatchEvent(new KeyboardEvent('keydown', { key: '2' }));
      expect(eventRouter.getCurrentLayer().id).toBe('Layer02');

      window.dispatchEvent(new KeyboardEvent('keydown', { key: '1' }));
      expect(eventRouter.getCurrentLayer().id).toBe('Layer01');
    });

    // 2キーでレイヤーを切り替えてから線を引くと、2枚目のレイヤーにだけ描かれる
    it('draws the stroke only on the second layer after switching with the 2 key', () => {
      const baseCanvas = document.createElement('canvas');
      const layerCanvas1 = document.createElement('canvas');
      const layerCanvas2 = document.createElement('canvas');
      const layerStack = new CanvasLayerStack([layerCanvas1, layerCanvas2]);
      createEventRouter(
        baseCanvas,
        layerStack,
        new ToolState(layerStack),
        createBrushCursor(layerStack),
      );

      window.dispatchEvent(new KeyboardEvent('keydown', { key: '2' }));
      baseCanvas.dispatchEvent(
        createPointerEvent('pointerdown', { x: 0, y: 0 }),
      );
      baseCanvas.dispatchEvent(
        createPointerEvent('pointermove', { x: 10, y: 10 }),
      );
      baseCanvas.dispatchEvent(
        createPointerEvent('pointerup', { x: 10, y: 10 }),
      );

      const [, , , alpha1] = layerCanvas1
        .getContext('2d')!
        .getImageData(5, 5, 1, 1).data;
      expect(alpha1).toBe(0);

      const [, , , alpha2] = layerCanvas2
        .getContext('2d')!
        .getImageData(5, 5, 1, 1).data;
      expect(alpha2).toBeGreaterThan(0);
    });
  });

  describe('context menu', () => {
    // 右クリックでブラウザのコンテキストメニューが表示されない
    it('prevents the default context menu from appearing on right-click', () => {
      const event = new MouseEvent('contextmenu', {
        bubbles: true,
        cancelable: true,
        button: 2,
      });
      const notPrevented = canvas.dispatchEvent(event);
      expect(notPrevented).toBe(false);
    });
  });

  describe('wheel', () => {
    // ブラウザ側にWheelイベントが伝播しない
    it('prevents the default wheel event from propagating to the browser', () => {
      const event = new WheelEvent('wheel', {
        bubbles: true,
        cancelable: true,
        deltaY: 100,
      });
      const notPrevented = canvas.dispatchEvent(event);
      expect(notPrevented).toBe(false);
    });
  });
});
