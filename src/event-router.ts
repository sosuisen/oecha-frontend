import { Tool } from './tool';
import { DrawCommand } from './draw-command';
import { PenCommand } from './pen-command';
import { Layer } from './layer';
import { CommandQueue } from './command-queue';

export class EventRouter {
  private currentTool: Tool;
  private canvas: HTMLCanvasElement;
  private lastPoint: { x: number; y: number } | null = null;
  private currentLayer: Layer;
  private commandQueue: CommandQueue;

  constructor(canvas: HTMLCanvasElement) {
    this.currentTool = Tool.Pen;
    this.currentLayer = new Layer('Layer01');
    this.canvas = canvas;
    this.commandQueue = new CommandQueue();
    this.canvas.addEventListener('pointerdown', e => {
      if (this.currentTool === Tool.Pen) {
        this.commandQueue.enqueue(new PenCommand(this.currentLayer));
        this.commandQueue.currentCommand()?.onPointerDown(e);
      }
    });
    this.canvas.addEventListener('pointermove', e => {
      if (this.commandQueue.currentCommand()) {
        this.commandQueue.currentCommand()?.onPointerMove(e);
        this.commandQueue.currentCommand()?.drawNextSegment();
      }
    });
    this.canvas.addEventListener('pointerup', e => {
      if (this.commandQueue.currentCommand()) {
        this.commandQueue.currentCommand()?.onPointerUp(e);
        this.commandQueue.currentCommand()?.drawNextSegment();
        this.commandQueue.advance();
      }
    });
  }

  public onPointerDown(event: PointerEvent): void {
    this.lastPoint = { x: event.clientX, y: event.clientY };
  }

  public getLastPoint(): { x: number; y: number } {
    return this.lastPoint!;
  }

  public getCurrentLayer(): Layer {
    return this.currentLayer;
  }

  public getCurrentCommand(): DrawCommand | null {
    return this.commandQueue.currentCommand();
  }

  public getCurrentTool(): Tool {
    return this.currentTool;
  }

  public setCurrentTool(tool: Tool): void {
    this.currentTool = tool;
  }
}
