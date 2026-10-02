import { Container, Graphics, Text } from 'pixi.js';
import { Input } from '@pixi/ui';
import { ToolState } from '../tool/tool-state';
import { ToolId } from '../tool/tool-id';
import { LayerStack } from '../layer/layer-stack';

export class Info {
  private static readonly FONT_SIZE = 24;
  private static readonly FONT_COLOR = 0x909090;
  private readonly root: Container;
  private readonly infoText: Text;
  private readonly colorPanel: Container;
  private readonly toolState: ToolState;
  private readonly layerStack: LayerStack;
  private currentColor = 0x000000;

  constructor(root: Container, toolState: ToolState, layerStack: LayerStack) {
    this.root = root;
    this.toolState = toolState;
    this.layerStack = layerStack;

    this.toolState.on('change', () => {
      this.infoText.text = this.getToolInfo();
      this.setCurrentColor(this.toolState.getCurrentColor());
    });

    this.layerStack.on('change', () => {
      this.infoText.text = this.getToolInfo();
    });

    this.infoText = new Text({
      text: this.getToolInfo(),
      style: {
        fontSize: Info.FONT_SIZE,
        fill: Info.FONT_COLOR,
      },
    });
    this.infoText.position.set(10, 10);

    this.colorPanel = this.createColorPanel(toolState);
  }

  private createColorPanel(toolState: ToolState): Container {
    const colorContainer = new Container();
    colorContainer.eventMode = 'static';
    colorContainer.position.set(300, 10);
    this.root.addChild(colorContainer);
    const rInput = this.createColorInput();
    rInput.value = '0';
    rInput.x = 10;
    rInput.onChange.connect(text => {
      this.setToolColor(toolState, text, gInput.value, bInput.value);
    });
    const gInput = this.createColorInput();
    gInput.value = '0';
    gInput.x = 70;
    gInput.onChange.connect(text => {
      this.setToolColor(toolState, rInput.value, text, bInput.value);
    });
    const bInput = this.createColorInput();
    bInput.value = '0';
    bInput.x = 130;
    bInput.onChange.connect(text => {
      this.setToolColor(toolState, rInput.value, gInput.value, text);
    });

    colorContainer.addChild(rInput);
    colorContainer.addChild(gInput);
    colorContainer.addChild(bInput);
    return colorContainer;
  }

  private getToolInfo(): string {
    const size = this.toolState.getCurrentTool().sizeSettings.get();
    const layer = this.layerStack.getCurrentLayer().name;
    return this.toolState.get() === ToolId.Pen
      ? `${layer} [Pen] ${size}px`
      : `${layer} [Eraser] ${size}px`;
  }

  setText(text: string) {
    this.infoText.text = text;
  }

  show() {
    this.root.addChild(this.infoText);
    this.root.addChild(this.colorPanel);
  }

  /**
   * Gets the current color.
   * @returns The current color as 0xRRGGBB.
   */
  getCurrentColor(): number {
    return this.currentColor;
  }

  setCurrentColor(color: number) {
    this.currentColor = color;
    this.updateColorInputs(color);
  }

  private updateColorInputs(color: number) {
    const r = (color >> 16) & 0xff;
    const g = (color >> 8) & 0xff;
    const b = color & 0xff;

    const rInput = this.colorPanel.children[0] as Input;
    const gInput = this.colorPanel.children[1] as Input;
    const bInput = this.colorPanel.children[2] as Input;

    rInput.value = r.toString();
    gInput.value = g.toString();
    bInput.value = b.toString();
  }

  private createColorInput() {
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
  }

  private setToolColor(
    toolState: ToolState,
    red: string,
    green: string,
    blue: string,
  ) {
    const r = parseInt(red) || 0;
    const g = parseInt(green) || 0;
    const b = parseInt(blue) || 0;
    const color = (r << 16) | (g << 8) | b;
    toolState.setCurrentColor(color);
  }
}
