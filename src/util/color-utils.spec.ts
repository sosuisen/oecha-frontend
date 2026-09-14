import { describe, it, expect } from 'vitest';
import { getCssRgb } from './color-utils';

describe('getCssRgb', () => {
  // 与えられた16進数のUint32カラー値をCSSのrgb形式に変換できる
  it('should convert a hex Uint32 color value to CSS rgb format', () => {
    const color: number = 0xff8000;
    const cssRgb: string = getCssRgb(color);
    expect(cssRgb).toBe('rgb(255, 128, 0)');
  });

  // 無効なカラー値が与えられた場合、エラーをスローする
  it('should throw an error for invalid color values', () => {
    expect(() => getCssRgb(-1)).toThrow(
      'Invalid color value. Must be a 24-bit integer (0x000000 to 0xFFFFFF).',
    );
    expect(() => getCssRgb(0x1000000)).toThrow(
      'Invalid color value. Must be a 24-bit integer (0x000000 to 0xFFFFFF).',
    );
  });
});
