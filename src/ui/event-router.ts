import { ToolId } from '../tool/tool-id';
import { DrawCommand } from '../command/draw-command';
import { TextureLayer } from '../layer/texture-layer';
import { Layer } from '../layer/layer';
import { CommandQueue } from '../command/command-queue';
import { DrawLine } from '../layer/draw-line';
import { ToolState } from '../tool/tool-state';
import { BrushCursor } from './brush-cursor';

export class EventRouter {
  private readonly canvas: HTMLCanvasElement;
  private lastPoint: { x: number; y: number } | null = null;
  private readonly currentLayer: Layer;
  private readonly commandQueue: CommandQueue;
  private readonly toolState: ToolState;
  private readonly brushCursor: BrushCursor;

  constructor(
    canvas: HTMLCanvasElement,
    drawLine: DrawLine,
    toolState: ToolState,
    brushCursor: BrushCursor,
  ) {
    this.currentLayer = new TextureLayer('Layer01', drawLine);
    this.canvas = canvas;
    this.commandQueue = new CommandQueue();
    this.toolState = toolState;
    this.brushCursor = brushCursor;
    this.canvas.addEventListener('pointerdown', e => {
      this.onPointerDown(e);
      const currentTool = this.toolState.getCurrentTool();
      const command = currentTool.createCommand(this.currentLayer);
      this.commandQueue.enqueue(command);
      command.onPointerDown(e);
    });
    this.canvas.addEventListener('pointermove', e => {
      this.onPointerMove(e);
      if (this.commandQueue.currentCommand()) {
        this.commandQueue.currentCommand()?.onPointerMove(e);
      }
    });
    this.canvas.addEventListener('pointerup', e => {
      this.onPointerUp(e);
      if (this.commandQueue.currentCommand()) {
        this.commandQueue.currentCommand()?.onPointerUp(e);
        this.commandQueue.advance();
      }
    });
    this.canvas.addEventListener('wheel', e => {
      this.toolState.getCurrentTool().onWheel?.(e);
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
    this.brushCursor.setX(event.clientX);
    this.brushCursor.setY(event.clientY);
  }

  onPointerMove(event: PointerEvent): void {
    this.lastPoint = { x: event.clientX, y: event.clientY };
    this.brushCursor.setX(event.clientX);
    this.brushCursor.setY(event.clientY);
  }

  onPointerUp(event: PointerEvent): void {
    this.lastPoint = { x: event.clientX, y: event.clientY };
    this.brushCursor.setX(event.clientX);
    this.brushCursor.setY(event.clientY);
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
