import { Layer } from '../layer/layer';
import { Rect } from '../layer/rect';
import { Command } from './command';

export class ClearCommand implements Command {
  private readonly targetLayer: Layer;
  private readonly rect: Rect;

  constructor(layer: Layer, rect: Rect) {
    this.targetLayer = layer;
    this.rect = rect;
  }

  execute(): void {
    this.targetLayer.clearRect(this.rect);
  }
}
