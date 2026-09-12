import { Tool } from './tool';
import { DrawCommand } from './draw-command';
import { PenCommand } from './pen-command';
import { Layer } from './layer';

export class EventRouter {
  private currentTool: Tool;
  private canvas: HTMLCanvasElement;
  private lastPoint: { x: number; y: number } | null = null;
  private currentCommand: DrawCommand | null = null;
  private currentLayer: Layer;

  constructor(canvas: HTMLCanvasElement) {
    this.currentTool = Tool.Pen;
    this.currentLayer = new Layer('Layer01');
    this.canvas = canvas;
    this.canvas.addEventListener('pointerdown', e => {
      if (this.currentTool === Tool.Pen) {
        this.currentCommand = new PenCommand(this.currentLayer);
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
        this.currentCommand.execute();
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
