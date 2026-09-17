import { Layer } from './layer';

export interface LayerStack {
  getLayers(): Layer[];
  getCurrentLayer(): Layer;
  select(index: number): void;
}
