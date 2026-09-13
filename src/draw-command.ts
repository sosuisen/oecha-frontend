import { Layer } from './layer';
import { DrawLine } from './draw-line';

export abstract class DrawCommand {
  protected targetLayer: Layer;
  protected drawLine: DrawLine;

  constructor(layer: Layer, drawLine: DrawLine) {
    this.targetLayer = layer;
    this.drawLine = drawLine;
  }

  public getTargetLayer(): Layer {
    return this.targetLayer;
  }
  abstract drawNextSegment(): void;
  abstract execute(): void;
  abstract addPoint(x: number, y: number): void;
  abstract onPointerDown(event: PointerEvent): void;
  abstract onPointerMove(event: PointerEvent): void;
  abstract onPointerUp(event: PointerEvent): void;
}
