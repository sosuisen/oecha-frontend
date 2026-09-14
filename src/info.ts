import { Container, Text } from 'pixi.js';
import { ToolState } from './tool-state';
import { ToolId } from './tool-id';

export class Info {
  private readonly root: Container;
  private readonly infoText: Text;
  private readonly toolState: ToolState;

  private getToolInfo(): string {
    return this.toolState.get() === ToolId.Pen ? '[Pen]' : '[Eraser]';
  }

  constructor(root: Container, toolState: ToolState) {
    this.root = root;
    this.toolState = toolState;

    this.toolState.on('change', () => {
      this.infoText.text = this.getToolInfo();
    });

    this.infoText = new Text({
      text: this.getToolInfo(),
      style: {
        fontSize: 24,
        fill: 0xffffff,
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
