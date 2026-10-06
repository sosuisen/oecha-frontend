import { TextureLayer } from './texture-layer';
import { LayerStack } from './layer-stack';
import { Container } from 'pixi.js';

export type TextureLayerFactory = (id: string, name: string) => TextureLayer;

export class TextureLayerStack extends LayerStack<TextureLayer> {
  private static readonly LAYER_DEFS = [
    { id: 'Layer01', name: 'Layer 01' },
    { id: 'Layer02', name: 'Layer 02' },
  ];

  private readonly container = new Container();

  constructor(layerFactory: TextureLayerFactory) {
    super(
      TextureLayerStack.LAYER_DEFS.map(({ id, name }) =>
        layerFactory(id, name),
      ),
    );
    this.container.addChild(
      ...this.getLayers().map(layer => layer.layerSprite),
    );
  }

  getContainer() {
    return this.container;
  }
}
