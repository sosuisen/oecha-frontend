import { describe, it, expect } from 'vitest';
import { TextureLayerStack } from './texture-layer-stack';
import { TextureLayer } from './texture-layer';
import { CanvasSurface } from '../testing/canvas-surface';
import { Sprite } from 'pixi.js';

// レイヤーを管理するクラスのテスト
describe('TextureLayerStack', () => {
  // 初期状態で2枚のレイヤーを持つ
  it('has two layers initially', () => {
    const layerStack = new TextureLayerStack(
      id =>
        new TextureLayer(
          id,
          new CanvasSurface(document.createElement('canvas')),
          new Sprite(),
        ),
    );
    expect(layerStack.getLayers().length).toBe(2);
  });
});
