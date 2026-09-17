import { Layer } from '../layer/layer';
import { LayerStack } from '../layer/layer-stack';
import { CanvasLayer } from './canvas-layer';
import { CanvasSurface } from './canvas-surface';

function createCanvas(): HTMLCanvasElement {
  return document.createElement('canvas');
}

export class CanvasLayerStack implements LayerStack {
  private static readonly LAYER_IDS = ['Layer01', 'Layer02'];

  private readonly layers: Layer[];

  constructor(
    canvases: HTMLCanvasElement[] = [createCanvas(), createCanvas()],
  ) {
    this.layers = CanvasLayerStack.LAYER_IDS.map(
      (id, i) => new CanvasLayer(id, new CanvasSurface(canvases[i])),
    );
  }

  getLayers(): Layer[] {
    return this.layers;
  }
}
