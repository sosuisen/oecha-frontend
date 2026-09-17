import { TextureLayer } from './texture-layer';
import { LayerStack } from './layer-stack';

export type TextureLayerFactory = (id: string, name: string) => TextureLayer;

export class TextureLayerStack implements LayerStack {
  private static readonly LAYER_DEFS = [
    { id: 'Layer01', name: 'Layer 01' },
    { id: 'Layer02', name: 'Layer 02' },
  ];

  private readonly layers: TextureLayer[];
  private currentIndex = 0;

  constructor(layerFactory: TextureLayerFactory) {
    this.layers = TextureLayerStack.LAYER_DEFS.map(({ id, name }) =>
      layerFactory(id, name),
    );
  }

  getLayers(): TextureLayer[] {
    return this.layers;
  }

  getCurrentLayer(): TextureLayer {
    return this.layers[this.currentIndex];
  }

  select(index: number): void {
    this.currentIndex = index;
  }
}
