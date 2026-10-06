import { Application, Container, Sprite } from 'pixi.js';
import { EventRouter } from './ui/event-router';
import { TextureSurface } from './layer/texture-surface';
import { DEFAULT_BACKGROUND_COLOR, DEFAULT_CANVAS_SIZE } from './ui/background';
import { Info } from './ui/info';
import { ToolState } from './tool/tool-state';
import { BrushCursor } from './ui/brush-cursor';
import { TextureLayerStack } from './layer/texture-layer-stack';
import { TextureLayer } from './layer/texture-layer';
import { CompositeColorPicker } from './layer/composite-color-picker';

(async () => {
  const app = new Application();
  await app.init({
    background: DEFAULT_BACKGROUND_COLOR,
    width: DEFAULT_CANVAS_SIZE.width,
    height: DEFAULT_CANVAS_SIZE.height,
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
  app.stage.addChild(layerStack.getContainer());

  const toolState = new ToolState();
  const brushCursorContainer = new Container();
  const brushCursor = new BrushCursor(brushCursorContainer, toolState);
  const compositeColorPicker = new CompositeColorPicker(
    app,
    DEFAULT_BACKGROUND_COLOR,
    layerStack.getContainer(),
  );
  new EventRouter(app.canvas, layerStack, toolState, brushCursor, (x, y) =>
    compositeColorPicker.getColorAt(x, y),
  );

  app.stage.addChild(brushCursorContainer);

  const infoContainer = new Container();
  app.stage.addChild(infoContainer);
  const info = new Info(infoContainer, toolState, layerStack);
  info.show();

  brushCursor.show();
})();
