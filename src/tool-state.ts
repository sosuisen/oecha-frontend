import { EventEmitter } from 'pixi.js';
import { Tool } from './tool';

export class ToolState extends EventEmitter<{ change: [Tool] }> {
  private currentTool: Tool = Tool.Pen;

  public get(): Tool {
    return this.currentTool;
  }

  public set(tool: Tool): void {
    if (this.currentTool === tool) {
      return;
    }
    this.currentTool = tool;
    this.emit('change', tool);
  }

  public toggle(): void {
    const newTool = this.currentTool === Tool.Pen ? Tool.Eraser : Tool.Pen;
    this.set(newTool);
  }
}
