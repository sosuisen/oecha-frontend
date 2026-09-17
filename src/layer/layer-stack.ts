import { EventEmitter } from 'pixi.js';
import { Layer } from './layer';

export type LayerStackEvents = {
  change: [{ layer: Layer }];
};

export abstract class LayerStack<
  L extends Layer = Layer,
> extends EventEmitter<LayerStackEvents> {
  private readonly layers: L[];
  private currentIndex = 0;

  protected constructor(layers: L[]) {
    super();
    this.layers = layers;
  }

  getLayers(): L[] {
    return this.layers;
  }

  getCurrentLayer(): L {
    return this.layers[this.currentIndex];
  }

  select(index: number): void {
    if (this.currentIndex === index) {
      return;
    }
    this.currentIndex = index;
    this.emit('change', { layer: this.getCurrentLayer() });
  }
}
