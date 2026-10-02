import { Application, Container, Graphics, Sprite } from 'pixi.js';
import { Input } from '@pixi/ui';
import { EventRouter } from './ui/event-router';
import { TextureSurface } from './layer/texture-surface';
import { DEFAULT_BACKGROUND_COLOR, DEFAULT_CANVAS_SIZE } from './ui/background';
import { Info } from './ui/info';
import { ToolState } from './tool/tool-state';
import { BrushCursor } from './ui/brush-cursor';
import { TextureLayerStack } from './layer/texture-layer-stack';
import { TextureLayer } from './layer/texture-layer';

const createColorInput = () => {
  return new Input({
    bg: new Graphics()
      .roundRect(0, 0, 50, 30, 3)
      .fill(0xffffff)
      .stroke({ width: 1, color: 0x606060 }),
    textStyle: { fill: 0x000000, fontSize: 20 },
    padding: [5, 10, 5, 0],
    align: 'center',
    maxLength: 3,
    addMask: true,
  });
};

const setRgbColor = (
  toolState: ToolState,
  red: string,
  green: string,
  blue: string,
) => {
  const r = parseInt(red) || 0;
  const g = parseInt(green) || 0;
  const b = parseInt(blue) || 0;
  const color = (r << 16) | (g << 8) | b;
  toolState.setCurrentColor(color);
  toolState.setCurrentColor(color);
};

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
  layerStack.getLayers().forEach(layer => {
    app.stage.addChild(layer.layerSprite);
  });

  const toolState = new ToolState();
  const brushCursorContainer = new Container();
  const brushCursor = new BrushCursor(brushCursorContainer, toolState);
  new EventRouter(app.canvas, layerStack, toolState, brushCursor);

  const infoContainer = new Container();
  app.stage.addChild(infoContainer);
  const info = new Info(infoContainer, toolState, layerStack);
  info.show();

  app.stage.addChild(brushCursorContainer);

  const colorContainer = new Container();
  colorContainer.position.set(300, 10);
  app.stage.addChild(colorContainer);
  const rInput = createColorInput();
  rInput.value = '0';
  rInput.x = 10;
  rInput.onChange.connect(text => {
    setRgbColor(toolState, text, gInput.value, bInput.value);
  });
  const gInput = createColorInput();
  gInput.value = '0';
  gInput.x = 70;
  gInput.onChange.connect(text => {
    setRgbColor(toolState, rInput.value, text, bInput.value);
  });
  const bInput = createColorInput();
  bInput.value = '0';
  bInput.x = 130;
  bInput.onChange.connect(text => {
    setRgbColor(toolState, rInput.value, gInput.value, text);
  });

  colorContainer.addChild(rInput);
  colorContainer.addChild(gInput);
  colorContainer.addChild(bInput);

  brushCursor.show();
})();
