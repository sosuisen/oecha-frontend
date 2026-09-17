import { TextureLayer } from './texture-layer';
import { LayerStack } from './layer-stack';

export type TextureLayerFactory = (id: string) => TextureLayer;

export class TextureLayerStack implements LayerStack {
  private static readonly LAYER_IDS = ['Layer01', 'Layer02'];

  private readonly layers: TextureLayer[];

  constructor(layerFactory: TextureLayerFactory) {
    this.layers = TextureLayerStack.LAYER_IDS.map(id => layerFactory(id));
  }

  getLayers(): TextureLayer[] {
    return this.layers;
  }
}
