import { TextureLayer } from './texture-layer';
import { LayerStack } from './layer-stack';

export type TextureLayerFactory = (id: string, name: string) => TextureLayer;

export class TextureLayerStack extends LayerStack<TextureLayer> {
  private static readonly LAYER_DEFS = [
    { id: 'Layer01', name: 'Layer 01' },
    { id: 'Layer02', name: 'Layer 02' },
  ];

  constructor(layerFactory: TextureLayerFactory) {
    super(
      TextureLayerStack.LAYER_DEFS.map(({ id, name }) =>
        layerFactory(id, name),
      ),
    );
  }
}
