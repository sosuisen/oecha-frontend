import { describe, expect, it } from 'vitest';
import { DEFAULT_BACKGROUND_COLOR, DEFAULT_CANVAS_SIZE } from './background';

describe('Background', () => {
  // デフォルトの背景色が存在する
  it('has a default background color', () => {
    expect(DEFAULT_BACKGROUND_COLOR).toBe(0xffffff);
  });

  // デフォルトのキャンバスサイズが存在する
  it('has a default canvas size', () => {
    expect(DEFAULT_CANVAS_SIZE).toEqual({ width: 1000, height: 1000 });
  });
});
