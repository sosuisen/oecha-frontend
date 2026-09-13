import { Application, RenderTexture, Sprite } from 'pixi.js';
import { EventRouter } from './event-router';
import { DrawLineOnTexture } from './draw-line-on-texture';
import { DEFAULT_BACKGROUND_COLOR } from './background';

(async () => {
  const app = new Application();
  await app.init({
    background: DEFAULT_BACKGROUND_COLOR,
    resizeTo: window,
  });

  console.log(app.renderer.name); // 'webgl' or 'webgpu'

  document.getElementById('pixi-container')!.appendChild(app.canvas);

  // 1. レイヤーの実体。GPU 上のピクセルバッファ
  const renderTexture = RenderTexture.create({
    width: app.canvas.width,
    height: app.canvas.height,
  });

  // 2. 画面に見せるための Sprite。テクスチャを参照するだけ
  const layerSprite = new Sprite(renderTexture);
  app.stage.addChild(layerSprite);

  new EventRouter(app.canvas, new DrawLineOnTexture(app, renderTexture));
})();
