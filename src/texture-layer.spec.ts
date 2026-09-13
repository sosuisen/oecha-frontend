import { describe, it, expect } from 'vitest';
import { TextureLayer } from './texture-layer';

// レイヤーのテスト
describe('Layer', () => {
  // コンストラクタで渡した ID を返す
  it('returns the ID given to the constructor', () => {
    const layer = new TextureLayer('Layer01');
    expect(layer.getId()).toBe('Layer01');
  });
});
