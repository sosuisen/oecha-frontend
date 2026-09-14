import { describe, it, expect } from 'vitest';
import { TextureLayer } from './texture-layer';
import { DrawLineOnCanvas } from '../testing/draw-line-on-canvas';

// レイヤーのテスト
describe('Layer', () => {
  // コンストラクタで渡した ID を返す
  it('returns the ID given to the constructor', () => {
    const layer = new TextureLayer(
      'Layer01',
      new DrawLineOnCanvas(document.createElement('canvas')),
    );
    expect(layer.id).toBe('Layer01');
  });
});
