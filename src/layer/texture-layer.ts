import { PointData } from 'pixi.js';
import { Layer } from './layer';
import { DrawingSurface, DrawOptions } from './drawing-surface';
import { Rect } from './rect';

export class TextureLayer implements Layer {
  readonly id: string;
  private readonly surface: DrawingSurface;

  constructor(id: string, surface: DrawingSurface) {
    this.id = id;
    this.surface = surface;
  }

  drawLine(from: PointData, to: PointData, drawOptions: DrawOptions): void {
    this.surface.drawLine(from, to, drawOptions);
  }

  clearRect(rect: Rect): void {
    this.surface.clearRect(rect);
  }
}
