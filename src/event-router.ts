import { ToolId } from './tool-id';
import { DrawCommand } from './draw-command';
import { TextureLayer } from './texture-layer';
import { Layer } from './layer';
import { CommandQueue } from './command-queue';
import { DrawLine } from './draw-line';
import { ToolState } from './tool-state';

export class EventRouter {
  private readonly canvas: HTMLCanvasElement;
  private lastPoint: { x: number; y: number } | null = null;
  private readonly currentLayer: Layer;
  private readonly commandQueue: CommandQueue;
  private readonly toolState: ToolState;

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
      const currentTool = this.toolState.getCurrentTool();
      const command = currentTool.createCommand(this.currentLayer);
      this.commandQueue.enqueue(command);
      command.onPointerDown(e);
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

  onPointerDown(event: PointerEvent): void {
    this.lastPoint = { x: event.clientX, y: event.clientY };
  }

  getLastPoint(): { x: number; y: number } {
    return this.lastPoint!;
  }

  getCurrentLayer(): Layer {
    return this.currentLayer;
  }

  getCurrentCommand(): DrawCommand | null {
    return this.commandQueue.currentCommand();
  }

  getCurrentTool(): ToolId {
    return this.toolState.get();
  }
}
