import { EventEmitter } from 'pixi.js';
import { ToolId } from './tool-id';
import { Tool } from './tool';
import { PenTool } from './pen-tool';
import { EraserTool } from './eraser-tool';

export class ToolState extends EventEmitter<{ change: [ToolId] }> {
  private currentTool: ToolId = ToolId.Pen;

  private readonly tools: Record<ToolId, Tool> = {
    [ToolId.Pen]: new PenTool(),
    [ToolId.Eraser]: new EraserTool(),
  };

  get(): ToolId {
    return this.currentTool;
  }

  set(tool: ToolId): void {
    if (this.currentTool === tool) {
      return;
    }
    this.currentTool = tool;
    this.emit('change', tool);
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
