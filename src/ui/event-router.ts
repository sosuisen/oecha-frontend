import { ToolId } from '../tool/tool-id';
import { DrawCommand } from '../command/draw-command';
import { Layer } from '../layer/layer';
import { CommandQueue } from '../command/command-queue';
import { ToolState } from '../tool/tool-state';
import { BrushCursor } from './brush-cursor';
import { ClearCommand } from '../command/clear-command';
import { Command } from '../command/command';
import { LayerStack } from '../layer/layer-stack';

export class EventRouter {
  private readonly canvas: HTMLCanvasElement;
  private lastPoint: { x: number; y: number } | null = null;
  private readonly layerStack: LayerStack;
  private currentLayerIndex: number = 0;
  private readonly commandQueue: CommandQueue;
  private readonly toolState: ToolState;
  private readonly brushCursor: BrushCursor;

  private activeStroke: DrawCommand | null = null;

  private readonly onKeyDown = (e: KeyboardEvent) => {
    if (e.repeat) {
      return;
    }
    if (e.key === 'x' || e.key === 'X') {
      this.toolState.toggle();
      return;
    }
    if (e.key === 'p' || e.key === 'P') {
      this.toolState.set(ToolId.Pen);
      return;
    }
    if (e.key === 'e' || e.key === 'E') {
      this.toolState.set(ToolId.Eraser);
      return;
    }
    if (e.key === '1') {
      this.currentLayerIndex = 0;
      return;
    }
    if (e.key === '2') {
      this.currentLayerIndex = 1;
      return;
    }
    if (e.key === 'Delete') {
      const clearCommand = new ClearCommand(this.getCurrentLayer(), {
        x: 0,
        y: 0,
        width: this.canvas.width,
        height: this.canvas.height,
      });
      this.commandQueue.enqueue(clearCommand);
      this.commandQueue.step();
      return;
    }
  };

  constructor(
    canvas: HTMLCanvasElement,
    layerStack: LayerStack,
    toolState: ToolState,
    brushCursor: BrushCursor,
  ) {
    this.layerStack = layerStack;
    this.canvas = canvas;
    this.commandQueue = new CommandQueue();
    this.toolState = toolState;
    this.brushCursor = brushCursor;
    this.canvas.addEventListener('pointerdown', e => {
      this.onPointerDown(e);
      const currentTool = this.toolState.getCurrentTool();
      const command = currentTool.createCommand(this.getCurrentLayer());
      this.commandQueue.enqueue(command);
      this.activeStroke = command;
      command.onPointerDown(e);
    });
    this.canvas.addEventListener('pointermove', e => {
      this.onPointerMove(e);
      this.activeStroke?.onPointerMove(e);
    });
    this.canvas.addEventListener('pointerup', e => {
      this.onPointerUp(e);
      if (this.activeStroke) {
        this.activeStroke.onPointerUp(e);
        this.commandQueue.advance();
        this.activeStroke = null;
      }
    });
    this.canvas.addEventListener('wheel', e => {
      this.toolState.getCurrentTool().onWheel?.(e);
    });
    window.addEventListener('keydown', this.onKeyDown);
  }

  destroy() {
    window.removeEventListener('keydown', this.onKeyDown);
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
    return this.layerStack.getLayers()[this.currentLayerIndex];
  }

  getCurrentCommand(): Command | null {
    return this.commandQueue.currentCommand();
  }

  getCurrentTool(): ToolId {
    return this.toolState.get();
  }
}
