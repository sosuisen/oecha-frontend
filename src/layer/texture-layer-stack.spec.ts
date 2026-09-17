import { describe, it, expect } from 'vitest';
import { TextureLayerStack } from './texture-layer-stack';
import { TextureLayer } from './texture-layer';
import { Layer } from './layer';
import { CanvasSurface } from '../testing/canvas-surface';
import { Sprite } from 'pixi.js';

function createLayerStack(): TextureLayerStack {
  return new TextureLayerStack(
    (id, name) =>
      new TextureLayer(
        id,
        name,
        new CanvasSurface(document.createElement('canvas')),
        new Sprite(),
      ),
  );
}

// レイヤーを管理するクラスのテスト
describe('TextureLayerStack', () => {
  // 初期状態で2枚のレイヤーを持つ
  it('has two layers initially', () => {
    const layerStack = createLayerStack();
    expect(layerStack.getLayers().length).toBe(2);
  });

  // select すると、選んだレイヤーを引数にして change イベントが発火する
  it('emits a change event with the selected layer when select is called', () => {
    const layerStack = createLayerStack();
    let changedLayer: Layer | null = null;
    layerStack.on('change', e => (changedLayer = e.layer));

    layerStack.select(1);

    expect(changedLayer).toBe(layerStack.getLayers()[1]);
  });

  // 同じ index を select しても、change イベントは発火しない
  it('does not emit a change event when the same index is selected', () => {
    const layerStack = createLayerStack();
    let invoked = false;
    layerStack.on('change', () => (invoked = true));

    layerStack.select(0);

    expect(invoked).toBe(false);
  });
});
