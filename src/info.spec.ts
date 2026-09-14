import { describe, it, expect } from 'vitest';
import { Container, Text } from 'pixi.js';
import { Info } from './info';

// Test suite for the info module
describe('info', () => {
  // 情報を画面に表示することができる
  it('should be show on the screen', () => {
    const root = new Container();
    const info = new Info(root);
    info.show();
    expect(root.children.length).toBe(1);
  });

  // 情報のテキストを変更することができる
  it('should be able to change the text', () => {
    const root = new Container();
    const info = new Info(root);
    info.show();
    info.setText('New Info');
    const text = root.children[0] as Text;
    expect(text.text).toBe('New Info');
  });
});
