import { describe, it, expect } from 'vitest';
import { Layer } from './layer';
import { Graphics } from 'pixi.js';

// レイヤーのテスト
describe('Layer', () => {
  // コンストラクタで渡した ID を返す
  it('returns the ID given to the constructor', () => {
    const layer = new Layer('Layer01');
    expect(layer.getId()).toBe('Layer01');
  });

  // getGraphics() は Graphics オブジェクトを返す
  it('returns a Graphics object from getGraphics()', () => {
    const layer = new Layer('Layer01');
    expect(layer.getGraphics()).toBeInstanceOf(Graphics);
  });
});
