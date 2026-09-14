import { ToolId } from './tool-id';
import { DrawCommand } from './draw-command';
import { PenCommand } from './pen-command';
import { EraserCommand } from './eraser-command';
import { TextureLayer } from './texture-layer';
import { Layer } from './layer';
import { CommandQueue } from './command-queue';
import { DrawLine } from './draw-line';
import { ToolState } from './tool-state';

export class EventRouter {
  private canvas: HTMLCanvasElement;
  private lastPoint: { x: number; y: number } | null = null;
  private currentLayer: Layer;
  private commandQueue: CommandQueue;
  private toolState: ToolState;

  constructor(
    canvas: HTMLCanvasElement,
    drawLine: DrawLine,
    toolState: ToolState,
  ) {
    this.currentLayer = new TextureLayer('Layer01', drawLine);
    this.canvas = canvas;
    this.commandQueue = new CommandQueue();
    this.toolState = toolState;
    this.canvas.addEventListener('pointerdown', e => {
      if (this.toolState.get() === ToolId.Pen) {
        this.commandQueue.enqueue(new PenCommand(this.currentLayer));
      } else if (this.toolState.get() === ToolId.Eraser) {
        this.commandQueue.enqueue(new EraserCommand(this.currentLayer));
      }
      this.commandQueue.currentCommand()?.onPointerDown(e);
    });
    this.canvas.addEventListener('pointermove', e => {
      if (this.commandQueue.currentCommand()) {
        this.commandQueue.currentCommand()?.onPointerMove(e);
      }
    });
    this.canvas.addEventListener('pointerup', e => {
      if (this.commandQueue.currentCommand()) {
        this.commandQueue.currentCommand()?.onPointerUp(e);
        this.commandQueue.advance();
      }
    });
    window.addEventListener('keydown', e => {
      if (e.repeat) {
        return;
      }
      if (e.key === 'x' || e.key === 'X') {
        this.toolState.toggle();
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

  public getCurrentTool(): ToolId {
    return this.toolState.get();
  }
}
