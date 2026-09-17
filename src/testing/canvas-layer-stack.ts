import { LayerStack } from '../layer/layer-stack';
import { CanvasLayer } from './canvas-layer';
import { CanvasSurface } from './canvas-surface';

function createCanvas(): HTMLCanvasElement {
  return document.createElement('canvas');
}

export class CanvasLayerStack extends LayerStack<CanvasLayer> {
  private static readonly LAYER_DEFS = [
    { id: 'Layer01', name: 'Layer 01' },
    { id: 'Layer02', name: 'Layer 02' },
  ];

  constructor(
    canvases: HTMLCanvasElement[] = [createCanvas(), createCanvas()],
  ) {
    super(
      CanvasLayerStack.LAYER_DEFS.map(
        ({ id, name }, i) =>
          new CanvasLayer(id, name, new CanvasSurface(canvases[i])),
      ),
    );
  }
}
