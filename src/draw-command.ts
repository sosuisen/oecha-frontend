import { Layer } from './layer';

export abstract class DrawCommand {
  protected targetLayer: Layer | null = null;

  public setTargetLayer(layer: Layer): void {
    this.targetLayer = layer;
  }

  public getTargetLayer(): Layer | null {
    return this.targetLayer;
  }
  abstract execute(): void;
  abstract onPointerDown(event: PointerEvent): void;
  abstract onPointerMove(event: PointerEvent): void;
  abstract onPointerUp(event: PointerEvent): void;
}
