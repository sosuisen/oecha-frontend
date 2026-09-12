import { Layer } from './layer';

export abstract class DrawCommand {
  protected targetLayer: Layer;

  constructor(layer: Layer) {
    this.targetLayer = layer;
  }

  public getTargetLayer(): Layer {
    return this.targetLayer;
  }
  abstract execute(): void;
  abstract addPoint(x: number, y: number): void;
  abstract onPointerDown(event: PointerEvent): void;
  abstract onPointerMove(event: PointerEvent): void;
  abstract onPointerUp(event: PointerEvent): void;
}
