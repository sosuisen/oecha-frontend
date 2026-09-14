import { describe, it, expect } from 'vitest';
import { ToolState } from './tool-state';
import { ToolId } from './tool-id';
import { PenTool } from './pen-tool';
import { EraserTool } from './eraser-tool';

describe('ToolState', () => {
  // 初期状態ではペンツールが選択されている
  it('should have the pen tool selected by default', () => {
    const toolState = new ToolState();
    expect(toolState.get()).toBe(ToolId.Pen);
  });

  // ペンツールに切り替えられる
  it('switches to the pen tool', () => {
    const toolState = new ToolState();
    toolState.set(ToolId.Pen);
    expect(toolState.get()).toBe(ToolId.Pen);
  });

  // 消しゴムツールに切り替えられる
  it('switches to the eraser tool', () => {
    const toolState = new ToolState();
    toolState.set(ToolId.Eraser);
    expect(toolState.get()).toBe(ToolId.Eraser);
  });

  // 値をペンと消しゴムの間でトグルできる
  it('should be able to toggle the value', () => {
    const toolState = new ToolState();
    toolState.set(ToolId.Pen);
    expect(toolState.get()).toBe(ToolId.Pen);
    toolState.toggle();
    expect(toolState.get()).toBe(ToolId.Eraser);
    toolState.toggle();
    expect(toolState.get()).toBe(ToolId.Pen);
  });

  // 値が変更されたときにイベントが発火する
  it('should emit change event when the value is changed', () => {
    const toolState = new ToolState();
    toolState.set(ToolId.Pen);

    let currentTool: ToolId | null = null;
    toolState.on('change', tool => (currentTool = tool));
    toolState.set(ToolId.Eraser);
    expect(currentTool).toBe(ToolId.Eraser);
  });

  // 値が変更されなかった場合、イベントは発火しない
  it('should not emit change event when the value is not changed', () => {
    const toolState = new ToolState();
    toolState.set(ToolId.Pen);

    let currentTool: ToolId | null = null;
    toolState.on('change', tool => (currentTool = tool));
    toolState.set(ToolId.Pen);
    expect(currentTool).toBe(null);
  });

  // getCurrentTool() は現在のツールのインスタンスを返す
  it('getCurrentTool() returns the instance of the current tool', () => {
    const toolState = new ToolState();
    toolState.set(ToolId.Pen);
    expect(toolState.getCurrentTool()).toBeInstanceOf(PenTool);
    toolState.set(ToolId.Eraser);
    expect(toolState.getCurrentTool()).toBeInstanceOf(EraserTool);
  });
});
