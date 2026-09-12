import { Tool } from './tool';
import { DrawCommand } from './draw-command';
import { PenCommand } from './pen-command';

export class EventRouter {
  private currentTool: Tool;
  private canvas: HTMLCanvasElement;
  private lastPoint: { x: number; y: number } | null = null;
  private currentCommand: DrawCommand | null = null;

  constructor(canvas: HTMLCanvasElement) {
    this.currentTool = Tool.Pen;
    this.canvas = canvas;
    this.canvas.addEventListener('pointerdown', e => {
      if (this.currentTool === Tool.Pen) {
        this.currentCommand = new PenCommand();
        this.currentCommand.onPointerDown(e);
      }
    });
    this.canvas.addEventListener('pointermove', e => {
      if (this.currentCommand) {
        this.currentCommand.onPointerMove(e);
      }
    });
    this.canvas.addEventListener('pointerup', e => {
      if (this.currentCommand) {
        this.currentCommand.onPointerUp(e);
      }
    });
  }

  public onPointerDown(event: PointerEvent): void {
    this.lastPoint = { x: event.clientX, y: event.clientY };
  }

  public getLastPoint(): { x: number; y: number } {
    return this.lastPoint!;
  }

  public getCurrentCommand(): DrawCommand | null {
    return this.currentCommand;
  }

  public getCurrentTool(): Tool {
    return this.currentTool;
  }

  public setCurrentTool(tool: Tool): void {
    this.currentTool = tool;
  }
}
