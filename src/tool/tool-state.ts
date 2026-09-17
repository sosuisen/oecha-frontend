import { EventEmitter } from 'pixi.js';
import { ToolId } from './tool-id';
import { Tool } from './tool';
import { PenTool } from './pen-tool';
import { EraserTool } from './eraser-tool';
import { LayerStack } from '../layer/layer-stack';
import { Layer } from '../layer/layer';

export type ToolStateEvents = {
  change: [{ tool: ToolId; size: number }];
};

export class ToolState extends EventEmitter<ToolStateEvents> {
  static readonly LAYER01_COLOR = 0x70d0ff;
  static readonly LAYER02_COLOR = 0x000000;

  private currentTool: ToolId = ToolId.Pen;
  private currentColor: number = 0x000000;

  private readonly tools: Record<ToolId, Tool> = {
    [ToolId.Pen]: new PenTool(),
    [ToolId.Eraser]: new EraserTool(),
  };

  constructor(layerStack: LayerStack) {
    super();
    for (const tool of Object.values(this.tools)) {
      tool.sizeSettings.on('change', size =>
        this.emit('change', { tool: this.currentTool, size }),
      );
    }
    this.applyLayerColor(layerStack.getCurrentLayer());
    layerStack.on('change', event => this.applyLayerColor(event.layer));
  }

  private applyLayerColor(layer: Layer): void {
    this.currentColor =
      layer.id === 'Layer01'
        ? ToolState.LAYER01_COLOR
        : ToolState.LAYER02_COLOR;
    (this.tools[ToolId.Pen] as PenTool).setColor(this.currentColor);
  }

  get(): ToolId {
    return this.currentTool;
  }

  getCurrentColor(): number {
    return this.currentColor;
  }

  set(tool: ToolId): void {
    if (this.currentTool === tool) {
      return;
    }
    this.currentTool = tool;
    this.emit('change', { tool, size: this.tools[tool].sizeSettings.get() });
  }

  getCurrentTool(): Tool {
    return this.tools[this.currentTool];
  }

  toggle(): void {
    const newTool =
      this.currentTool === ToolId.Pen ? ToolId.Eraser : ToolId.Pen;
    this.set(newTool);
  }
}
