import { Application, Container, RenderTexture, Sprite } from 'pixi.js';
import { EventRouter } from './ui/event-router';
import { TextureSurface } from './layer/texture-surface';
import { DEFAULT_BACKGROUND_COLOR } from './ui/background';
import { Info } from './ui/info';
import { ToolState } from './tool/tool-state';
import { BrushCursor } from './ui/brush-cursor';

(async () => {
  const app = new Application();
  await app.init({
    background: DEFAULT_BACKGROUND_COLOR,
    resizeTo: window,
    antialias: true,
  });
  app.stage.eventMode = 'static';
  app.stage.hitArea = app.screen;
  app.stage.cursor = 'none';

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

  const toolState = new ToolState();

  const infoContainer = new Container();
  app.stage.addChild(infoContainer);
  const info = new Info(infoContainer, toolState);
  info.show();

  const brushCursorContainer = new Container();
  app.stage.addChild(brushCursorContainer);
  const brushCursor = new BrushCursor(brushCursorContainer, toolState);
  brushCursor.show();

  new EventRouter(
    app.canvas,
    new TextureSurface(app, renderTexture),
    toolState,
    brushCursor,
  );
})();
