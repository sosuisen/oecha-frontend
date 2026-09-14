import { describe, it, expect } from 'vitest';
import { ToolState } from './tool-state';
import { Tool } from './tool';

describe('ToolState', () => {
  // 初期状態ではペンツールが選択されている
  it('should have the pen tool selected by default', () => {
    const toolState = new ToolState();
    expect(toolState.get()).toBe(Tool.Pen);
  });

  // ペンツールに切り替えられる
  it('switches to the pen tool', () => {
    const toolState = new ToolState();
    toolState.set(Tool.Pen);
    expect(toolState.get()).toBe(Tool.Pen);
  });

  // 消しゴムツールに切り替えられる
  it('switches to the eraser tool', () => {
    const toolState = new ToolState();
    toolState.set(Tool.Eraser);
    expect(toolState.get()).toBe(Tool.Eraser);
  });

  // 値をペンと消しゴムの間でトグルできる
  it('should be able to toggle the value', () => {
    const toolState = new ToolState();
    toolState.set(Tool.Pen);
    expect(toolState.get()).toBe(Tool.Pen);
    toolState.toggle();
    expect(toolState.get()).toBe(Tool.Eraser);
    toolState.toggle();
    expect(toolState.get()).toBe(Tool.Pen);
  });

  // 値が変更されたときにイベントが発火する
  it('should emit change event when the value is changed', () => {
    const toolState = new ToolState();
    toolState.set(Tool.Pen);

    let currentTool: Tool | null = null;
    toolState.on('change', tool => (currentTool = tool));
    toolState.set(Tool.Eraser);
    expect(currentTool).toBe(Tool.Eraser);
  });

  // 値が変更されなかった場合、イベントは発火しない
  it('should not emit change event when the value is not changed', () => {
    const toolState = new ToolState();
    toolState.set(Tool.Pen);

    let currentTool: Tool | null = null;
    toolState.on('change', tool => (currentTool = tool));
    toolState.set(Tool.Pen);
    expect(currentTool).toBe(null);
  });
});
