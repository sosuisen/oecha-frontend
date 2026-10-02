import { describe, it, expect, beforeAll } from 'vitest';
import { Container, Text } from 'pixi.js';
import { Info } from './info';
import { ToolState } from '../tool/tool-state';
import { ToolId } from '../tool/tool-id';
import { CanvasLayerStack } from '../testing/canvas-layer-stack';

// Test suite for the info module
describe('info', () => {
  beforeAll(() => {
    const ctx = document.createElement('canvas').getContext('2d');
    if (ctx && typeof globalThis.CanvasRenderingContext2D === 'undefined') {
      globalThis.CanvasRenderingContext2D =
        ctx.constructor as typeof CanvasRenderingContext2D;
    }
  });

  // 情報を画面に表示することができる
  it('should be show on the screen', () => {
    const root = new Container();
    const layerStack = new CanvasLayerStack();
    const info = new Info(root, new ToolState(), layerStack);
    info.show();
    expect(root.children.length).toBeGreaterThan(0);
  });

  // 情報のテキストを変更することができる
  it('should be able to change the text', () => {
    const root = new Container();
    const layerStack = new CanvasLayerStack();
    const info = new Info(root, new ToolState(), layerStack);
    info.show();
    info.setText('New Info');
    const text = root.children[0] as Text;
    expect(text.text).toBe('New Info');
  });

  // ツールの状態が変化すると、ツールの情報を表示する。
  it('should update the text when the tool state changes', () => {
    const root = new Container();
    const layerStack = new CanvasLayerStack();
    const toolState = new ToolState();
    toolState.set(ToolId.Pen);
    const info = new Info(root, toolState, layerStack);
    info.show();
    info.setText('Initial Info');

    const text = root.children[0] as Text;
    toolState.set(ToolId.Eraser);
    toolState.getCurrentTool().sizeSettings.set(50);
    expect(text.text).toBe('Layer 01 [Eraser] 50px');
    toolState.getCurrentTool().sizeSettings.set(100);
    expect(text.text).toBe('Layer 01 [Eraser] 100px');
  });

  // 現在のレイヤー名が、ツール情報の手前に表示される
  it('shows the current layer name before the tool info', () => {
    const root = new Container();
    const layerStack = new CanvasLayerStack();
    const info = new Info(root, new ToolState(), layerStack);
    info.show();
    const text = root.children[0] as Text;
    expect(text.text).toBe('Layer 01 [Pen] 2px');
  });

  // レイヤーを切り替えると、表示されるレイヤー名が変わる
  it('updates the layer name when the current layer changes', () => {
    const root = new Container();
    const layerStack = new CanvasLayerStack();
    const info = new Info(root, new ToolState(), layerStack);
    info.show();
    const text = root.children[0] as Text;

    layerStack.select(1);
    expect(text.text).toBe('Layer 02 [Pen] 2px');
  });

  // 現在の色が変わると、表示される色の情報が変わる
  it('updates the color info when the current color changes', () => {
    const root = new Container();
    const layerStack = new CanvasLayerStack();
    const toolState = new ToolState();
    toolState.setCurrentColor(0x000000);
    const info = new Info(root, toolState, layerStack);
    info.show();
    const color = info.getCurrentColor();
    expect(color).toBe(0x000000);

    toolState.setCurrentColor(0xff0000);
    const newColor = info.getCurrentColor();
    expect(newColor).toBe(0xff0000);
  });
});
