import { describe, it, expect } from 'vitest';
import { EraserTool } from './eraser-tool';
import { SizeSettings } from './size-settings';
import { EraserCommand } from '../command/eraser-command';
import { Layer } from '../layer/layer';

describe('eraser-tool', () => {
  // 消しゴムツールはサイズ設定を持っている
  it('should have size settings', () => {
    const eraserTool = new EraserTool();
    expect(eraserTool.sizeSettings).toBeInstanceOf(SizeSettings);
  });

  // 消しゴムツールはラベルを持っている
  it('should have a label', () => {
    const eraserTool = new EraserTool();
    expect(eraserTool.label).toBe('Eraser');
  });

  // 消しゴムツールから消しゴムコマンドを生成することができる
  it('should be able to create an EraserCommand instance', () => {
    const eraserCommand = new EraserTool().createCommand({} as Layer);
    expect(eraserCommand).toBeInstanceOf(EraserCommand);
  });
});
