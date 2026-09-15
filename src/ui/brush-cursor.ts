import { Graphics, Container, Size } from 'pixi.js';
import { ToolState } from '../tool/tool-state';

export class BrushCursor {
  static readonly LINE_WIDTH = 1;
  static readonly COLOR = 0x606060;
  graphics: Graphics;
  private readonly container: Container;
  private readonly toolState: ToolState;

  constructor(container: Container, toolState: ToolState) {
    this.container = container;
    this.toolState = toolState;
    this.graphics = new Graphics();
    this.graphics.x = 0;
    this.graphics.y = 0;

    this.setSize(
      toolState.getCurrentTool().sizeSettings.get(),
      toolState.getCurrentTool().sizeSettings.get(),
    );
    toolState.on('change', () => {
      this.setSize(
        toolState.getCurrentTool().sizeSettings.get(),
        toolState.getCurrentTool().sizeSettings.get(),
      );
    });
  }

  getX(): number {
    return this.graphics.x;
  }

  setX(x: number) {
    this.graphics.x = x;
  }

  getY(): number {
    return this.graphics.y;
  }

  setY(y: number) {
    this.graphics.y = y;
  }

  getSize(): Size | undefined {
    return this.graphics.getSize();
  }

  setSize(width: number, height: number) {
    this.graphics
      .clear()
      .ellipse(0, 0, width / 2, height / 2)
      .stroke({ width: BrushCursor.LINE_WIDTH, color: BrushCursor.COLOR });
  }

  show() {
    this.container.addChild(this.graphics);
  }
}
