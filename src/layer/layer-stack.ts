import { Layer } from './layer';

export interface LayerStack {
  getLayers(): Layer[];
}
