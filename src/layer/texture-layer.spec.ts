import { describe, it, expect } from 'vitest';
import { TextureLayer } from './texture-layer';
import { CanvasSurface } from '../testing/canvas-surface';
import { Sprite } from 'pixi.js';

// レイヤーのテスト
describe('Layer', () => {
  // コンストラクタで渡した ID を返す
  it('returns the ID given to the constructor', () => {
    const layer = new TextureLayer(
      'Layer01',
      'Layer 01',
      new CanvasSurface(document.createElement('canvas')),
      new Sprite(),
    );
    expect(layer.id).toBe('Layer01');
  });
});
