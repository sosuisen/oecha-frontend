import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { ToolState } from './tool-state';
import { ToolId } from './tool-id';
import { PenTool } from './pen-tool';
import { EraserTool } from './eraser-tool';
import { CanvasLayerStack } from '../testing/canvas-layer-stack';
import { BrushCursor } from '../ui/brush-cursor';
import { EventRouter } from '../ui/event-router';
import { Container } from 'pixi.js';
import { LayerStack } from '../layer/layer-stack';

function createBrushCursor(layerStack: LayerStack): BrushCursor {
  const container = new Container();
  return new BrushCursor(container, new ToolState(layerStack));
}

const routers: EventRouter[] = [];

function createEventRouter(
  canvas: HTMLCanvasElement,
  toolState: ToolState,
  brushCursor: BrushCursor,
  layerStack: CanvasLayerStack = new CanvasLayerStack(),
): EventRouter {
  const router = new EventRouter(canvas, layerStack, toolState, brushCursor);
  routers.push(router);
  return router;
}

describe('ToolState', () => {
  let layerStack: CanvasLayerStack;

  beforeEach(() => {
    const layerCanvas1 = document.createElement('canvas');
    const layerCanvas2 = document.createElement('canvas');
    layerStack = new CanvasLayerStack([layerCanvas1, layerCanvas2]);
  });

  afterEach(() => {
    routers.forEach(router => router.destroy());
    routers.length = 0;
  });

  // 初期状態ではペンツールが選択されている
  it('should have the pen tool selected by default', () => {
    const toolState = new ToolState(layerStack);
    expect(toolState.get()).toBe(ToolId.Pen);
  });

  // ペンツールに切り替えられる
  it('switches to the pen tool', () => {
    const toolState = new ToolState(layerStack);
    toolState.set(ToolId.Pen);
    expect(toolState.get()).toBe(ToolId.Pen);
  });

  // 消しゴムツールに切り替えられる
  it('switches to the eraser tool', () => {
    const toolState = new ToolState(layerStack);
    toolState.set(ToolId.Eraser);
    expect(toolState.get()).toBe(ToolId.Eraser);
  });

  // 値をペンと消しゴムの間でトグルできる
  it('should be able to toggle the value', () => {
    const toolState = new ToolState(layerStack);
    toolState.set(ToolId.Pen);
    expect(toolState.get()).toBe(ToolId.Pen);
    toolState.toggle();
    expect(toolState.get()).toBe(ToolId.Eraser);
    toolState.toggle();
    expect(toolState.get()).toBe(ToolId.Pen);
  });

  // 値が変更されたときにイベントが発火する
  it('should emit change event when the value is changed', () => {
    const toolState = new ToolState(layerStack);
    toolState.set(ToolId.Pen);

    let currentTool: ToolId | null = null;
    toolState.on('change', event => (currentTool = event.tool));
    toolState.set(ToolId.Eraser);
    expect(currentTool).toBe(ToolId.Eraser);
  });

  // 値が変更されなかった場合、イベントは発火しない
  it('should not emit change event when the value is not changed', () => {
    const toolState = new ToolState(layerStack);
    toolState.set(ToolId.Pen);

    let currentTool: ToolId | null = null;
    toolState.on('change', event => (currentTool = event.tool));
    toolState.set(ToolId.Pen);
    expect(currentTool).toBe(null);
  });

  // getCurrentTool() は現在のツールのインスタンスを返す
  it('getCurrentTool() returns the instance of the current tool', () => {
    const toolState = new ToolState(layerStack);
    toolState.set(ToolId.Pen);
    expect(toolState.getCurrentTool()).toBeInstanceOf(PenTool);
    toolState.set(ToolId.Eraser);
    expect(toolState.getCurrentTool()).toBeInstanceOf(EraserTool);
  });

  // ツールのサイズが変わったときに、イベントが発火して、サイズを取得できる
  it('should emit change event when the tool size is changed', () => {
    const toolState = new ToolState(layerStack);
    toolState.set(ToolId.Pen);
    toolState.getCurrentTool().sizeSettings.set(10);

    let newSize: number | null = null;
    toolState.on('change', e => (newSize = e.size));
    toolState.getCurrentTool().sizeSettings.set(15);
    expect(newSize).toBe(15);
  });

  // Layer01が選択されているとき、現在の描画色は水色である
  it('should return the current drawing color when Layer01 is selected', () => {
    const baseCanvas = document.createElement('canvas');
    const layerCanvas1 = document.createElement('canvas');
    const layerCanvas2 = document.createElement('canvas');
    const layerStack = new CanvasLayerStack([layerCanvas1, layerCanvas2]);
    const toolState = new ToolState(layerStack);
    createEventRouter(
      baseCanvas,
      toolState,
      createBrushCursor(layerStack),
      layerStack,
    );
    layerStack.select(0); // select Layer01

    expect(toolState.getCurrentColor()).toBe(0x70d0ff);
  });

  // Layer02が選択されているとき、現在の描画色は黒色である
  it('should return the current drawing color when Layer02 is selected', () => {
    const baseCanvas = document.createElement('canvas');
    const layerCanvas1 = document.createElement('canvas');
    const layerCanvas2 = document.createElement('canvas');
    const layerStack = new CanvasLayerStack([layerCanvas1, layerCanvas2]);
    const toolState = new ToolState(layerStack);
    createEventRouter(
      baseCanvas,
      toolState,
      createBrushCursor(layerStack),
      layerStack,
    );
    layerStack.select(1); // select Layer02

    expect(toolState.getCurrentColor()).toBe(0x000000);
  });
});
