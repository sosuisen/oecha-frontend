import { describe, expect, it } from 'vitest';
import { DEFAULT_BACKGROUND_COLOR } from './background';

describe('Background', () => {
  // デフォルトの背景色が存在する
  it('has a default background color', () => {
    expect(DEFAULT_BACKGROUND_COLOR).toBe(0x1099bb);
  });
});
