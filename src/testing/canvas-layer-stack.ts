import { Layer } from '../layer/layer';
import { LayerStack } from '../layer/layer-stack';
import { CanvasLayer } from './canvas-layer';
import { CanvasSurface } from './canvas-surface';

export class CanvasLayerStack implements LayerStack {
  private readonly layers: Layer[] = [];

  constructor() {
    this.layers.push(
      new CanvasLayer(
        'Layer01',
        new CanvasSurface(document.createElement('canvas')),
      ),
    );
    this.layers.push(
      new CanvasLayer(
        'Layer02',
        new CanvasSurface(document.createElement('canvas')),
      ),
    );
  }

  getLayers(): Layer[] {
    return this.layers;
  }
}
