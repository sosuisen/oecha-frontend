import { DrawCommand } from './draw-command';
import { Layer } from './layer';

export class EraserCommand implements DrawCommand {
  private targetLayer: Layer;

  private points: { x: number; y: number }[] = [];
  private nextSegment: number = 0;

  constructor(layer: Layer) {
    this.targetLayer = layer;
  }

  drawNextSegment(): void {
    throw new Error('Method not implemented.');
  }
  execute(): void {
    throw new Error('Method not implemented.');
  }
  addPoint(x: number, y: number): void {
    console.log(`EraserCommand.addPoint called with x=${x}, y=${y}`);
    throw new Error('Method not implemented.');
  }
  onPointerDown(event: PointerEvent): void {
    console.log(`EraserCommand.onPointerDown called with event: ${event}`);
  }
  onPointerMove(event: PointerEvent): void {
    console.log(`EraserCommand.onPointerMove called with event: ${event}`);
    throw new Error('Method not implemented.');
  }
  onPointerUp(event: PointerEvent): void {
    console.log(`EraserCommand.onPointerUp called with event: ${event}`);
    throw new Error('Method not implemented.');
  }
}
