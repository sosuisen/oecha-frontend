import { describe, it, expect } from 'vitest';
import { Container, Text } from 'pixi.js';
import { Info } from './info';
import { ToolState } from './tool-state';
import { Tool } from './tool';

// Test suite for the info module
describe('info', () => {
  // 情報を画面に表示することができる
  it('should be show on the screen', () => {
    const root = new Container();
    const info = new Info(root, new ToolState());
    info.show();
    expect(root.children.length).toBe(1);
  });

  // 情報のテキストを変更することができる
  it('should be able to change the text', () => {
    const root = new Container();
    const info = new Info(root, new ToolState());
    info.show();
    info.setText('New Info');
    const text = root.children[0] as Text;
    expect(text.text).toBe('New Info');
  });

  // ツールの状態が変化すると、ツールの情報を表示する。
  it('should update the text when the tool state changes', () => {
    const root = new Container();
    const toolState = new ToolState();
    toolState.set(Tool.Pen);
    const info = new Info(root, toolState);
    info.show();
    info.setText('Initial Info');

    toolState.set(Tool.Eraser);
    const text = root.children[0] as Text;
    expect(text.text).toBe('[Eraser]');
  });
});
