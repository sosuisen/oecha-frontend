import { EventEmitter } from 'pixi.js';
import { ToolId } from './tool-id';
import { Tool } from './tool';
import { PenTool } from './pen-tool';
import { EraserTool } from './eraser-tool';

export type ToolStateEvents = {
  change: [{ tool: ToolId; size: number }];
};

export class ToolState extends EventEmitter<ToolStateEvents> {
  private currentTool: ToolId = ToolId.Pen;

  private readonly tools: Record<ToolId, Tool> = {
    [ToolId.Pen]: new PenTool(),
    [ToolId.Eraser]: new EraserTool(),
  };

  constructor() {
    super();
    for (const tool of Object.values(this.tools)) {
      tool.sizeSettings.on('change', size =>
        this.emit('change', { tool: this.currentTool, size }),
      );
    }
  }

  get(): ToolId {
    return this.currentTool;
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
