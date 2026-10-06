import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { Application, Container, Graphics } from 'pixi.js';
import { CompositeColorPicker } from './composite-color-picker';
import { createCanvasApp } from '../testing/canvas-app';

describe('CompositeColorPicker', () => {
  let app: Application;

  beforeEach(async () => {
    app = await createCanvasApp(100, 100);
  });

  afterEach(() => {
    app?.destroy();
  });

  // CompositeColorPickerは、Applicationと背景色とコンテナーをコンストラクターで受け取る。
  it('gets background color and container as constructor arguments', async () => {
    const backgroundColor = 0x123456;
    const container = new Container();
    const compositeColorPicker = new CompositeColorPicker(
      app,
      backgroundColor,
      container,
    );
    expect(compositeColorPicker).instanceOf(CompositeColorPicker);
  });

  // 指定された座標について、背景色の上に受け取ったコンテナーの色を合成して返す
  it('returns the color at the specified coordinates by compositing the container color over the background color', async () => {
    const backgroundColor = 0x123456;
    const container = new Container();
    container.addChild(new Graphics().rect(0, 0, 30, 30).stroke(0x000000));
    container.addChild(new Graphics().rect(10, 10, 10, 10).fill(0xff0000));
    const compositeColorPicker = new CompositeColorPicker(
      app,
      backgroundColor,
      container,
    );
    expect(compositeColorPicker.getColorAt(3, 3)).toBe(0x123456);
    expect(compositeColorPicker.getColorAt(15, 15)).toBe(0xff0000);
  });
});
