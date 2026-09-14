import { EventEmitter } from 'pixi.js';
import { ToolId } from './tool-id';

export class ToolState extends EventEmitter<{ change: [ToolId] }> {
  private currentTool: ToolId = ToolId.Pen;

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

  toggle(): void {
    const newTool =
      this.currentTool === ToolId.Pen ? ToolId.Eraser : ToolId.Pen;
    this.set(newTool);
  }
}
