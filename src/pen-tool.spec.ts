import { describe, it, expect } from 'vitest';
import { PenTool } from './pen-tool';
import { SizeSettings } from './size-settings';
import { PenCommand } from './pen-command';
import { Layer } from './layer';

describe('pen-tool', () => {
  // ペンツールはサイズ設定を持っている
  it('should have size settings', () => {
    const penTool = new PenTool();
    expect(penTool.sizeSettings).toBeInstanceOf(SizeSettings);
  });

  // ペンツールは色を持っている
  it('should have color settings', () => {
    const penTool = new PenTool();
    expect(penTool.getColor()).toBe(0xffffff); // デフォルトの色は白
  });

  // ペンツールはラベルを持っている
  it('should have a label', () => {
    const penTool = new PenTool();
    expect(penTool.label).toBe('Pen');
  });

  // ペンツールからペンコマンドを生成することができる
  it('should be able to create a PenTool instance', () => {
    const penCommand = new PenTool().createCommand({} as Layer);
    expect(penCommand).toBeInstanceOf(PenCommand);
  });
});
