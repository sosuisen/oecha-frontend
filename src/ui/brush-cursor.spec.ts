import { describe, it, expect, beforeEach } from 'vitest';
import { BrushCursor } from './brush-cursor';
import { Container } from 'pixi.js';
import { ToolState } from '../tool/tool-state';
import { CanvasLayerStack } from '../testing/canvas-layer-stack';

// マウスポインターの位置に表示されるブラシカーソルのテスト
describe('BrushCursor', () => {
  let layerStack: CanvasLayerStack;

  beforeEach(() => {
    const layerCanvas1 = document.createElement('canvas');
    const layerCanvas2 = document.createElement('canvas');
    layerStack = new CanvasLayerStack([layerCanvas1, layerCanvas2]);
  });

  // ブラシカーソルはグラフィックスを持つ
  it('has graphics', () => {
    const brushCursor = new BrushCursor(
      new Container(),
      new ToolState(layerStack),
    );
    expect(brushCursor.graphics).toBeDefined();
  });

  // ブラシカーソルの座標を変更できる
  it('can change coordinates', () => {
    const brushCursor = new BrushCursor(
      new Container(),
      new ToolState(layerStack),
    );
    brushCursor.setX(100);
    brushCursor.setY(200);
    expect(brushCursor.getX()).toBe(100);
    expect(brushCursor.getY()).toBe(200);
  });

  // グラフィックスの位置は,x,y座標に基づいて更新される
  it('updates graphics position based on x and y', () => {
    const brushCursor = new BrushCursor(
      new Container(),
      new ToolState(layerStack),
    );
    brushCursor.setX(50);
    brushCursor.setY(75);
    expect(brushCursor.getX()).toBe(50);
    expect(brushCursor.getY()).toBe(75);
  });

  // グラフィックスの幅と高さをセット、取得できる。
  it('has width and height', () => {
    const brushCursor = new BrushCursor(
      new Container(),
      new ToolState(layerStack),
    );
    brushCursor.setSize(120, 150);
    expect(brushCursor.getSize()?.width).toBe(120 + BrushCursor.LINE_WIDTH);
    expect(brushCursor.getSize()?.height).toBe(150 + BrushCursor.LINE_WIDTH);
  });

  // ブラシカーソルは、渡されたコンテナーに表示される。
  it('can be added to a canvas', () => {
    const root = new Container();
    const brushCursor = new BrushCursor(root, new ToolState(layerStack));
    brushCursor.show();
    expect(root.children).toContain(brushCursor.graphics);
  });
});
