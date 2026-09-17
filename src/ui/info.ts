import { Container, Text } from 'pixi.js';
import { ToolState } from '../tool/tool-state';
import { ToolId } from '../tool/tool-id';
import { LayerStack } from '../layer/layer-stack';

export class Info {
  private static readonly FONT_SIZE = 24;
  private static readonly FONT_COLOR = 0x909090;
  private readonly root: Container;
  private readonly infoText: Text;
  private readonly toolState: ToolState;
  private readonly layerStack: LayerStack;

  private getToolInfo(): string {
    const size = this.toolState.getCurrentTool().sizeSettings.get();
    const layer = this.layerStack.getCurrentLayer().name;
    return this.toolState.get() === ToolId.Pen
      ? `${layer} [Pen] ${size}px`
      : `${layer} [Eraser] ${size}px`;
  }

  constructor(root: Container, toolState: ToolState, layerStack: LayerStack) {
    this.root = root;
    this.toolState = toolState;
    this.layerStack = layerStack;

    this.toolState.on('change', () => {
      this.infoText.text = this.getToolInfo();
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
  }

  setText(text: string) {
    this.infoText.text = text;
  }

  show() {
    this.root.addChild(this.infoText);
  }
}
