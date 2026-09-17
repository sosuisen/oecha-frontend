import { Application, Container, Sprite } from 'pixi.js';
import { EventRouter } from './ui/event-router';
import { TextureSurface } from './layer/texture-surface';
import { DEFAULT_BACKGROUND_COLOR } from './ui/background';
import { Info } from './ui/info';
import { ToolState } from './tool/tool-state';
import { BrushCursor } from './ui/brush-cursor';
import { TextureLayerStack } from './layer/texture-layer-stack';
import { TextureLayer } from './layer/texture-layer';

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

  const layerStack = new TextureLayerStack((id, name) => {
    const surface = new TextureSurface(app);
    return new TextureLayer(
      id,
      name,
      surface,
      new Sprite(surface.getTexture()),
    );
  });
  layerStack.getLayers().forEach(layer => {
    app.stage.addChild(layer.layerSprite);
  });

  const toolState = new ToolState(layerStack);
  const brushCursorContainer = new Container();
  const brushCursor = new BrushCursor(brushCursorContainer, toolState);
  new EventRouter(app.canvas, layerStack, toolState, brushCursor);

  const infoContainer = new Container();
  app.stage.addChild(infoContainer);
  const info = new Info(infoContainer, toolState, layerStack);
  info.show();

  app.stage.addChild(brushCursorContainer);
  brushCursor.show();
})();
