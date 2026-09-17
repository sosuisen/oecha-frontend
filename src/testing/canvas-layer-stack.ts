import { Layer } from '../layer/layer';
import { LayerStack } from '../layer/layer-stack';
import { CanvasLayer } from './canvas-layer';
import { CanvasSurface } from './canvas-surface';

function createCanvas(): HTMLCanvasElement {
  return document.createElement('canvas');
}

export class CanvasLayerStack implements LayerStack {
  private static readonly LAYER_DEFS = [
    { id: 'Layer01', name: 'Layer 01' },
    { id: 'Layer02', name: 'Layer 02' },
  ];

  private readonly layers: Layer[];
  private currentIndex = 0;

  constructor(
    canvases: HTMLCanvasElement[] = [createCanvas(), createCanvas()],
  ) {
    this.layers = CanvasLayerStack.LAYER_DEFS.map(
      ({ id, name }, i) =>
        new CanvasLayer(id, name, new CanvasSurface(canvases[i])),
    );
  }

  getLayers(): Layer[] {
    return this.layers;
  }

  getCurrentLayer(): Layer {
    return this.layers[this.currentIndex];
  }

  select(index: number): void {
    this.currentIndex = index;
  }
}
