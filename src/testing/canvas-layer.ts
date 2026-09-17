import { Layer } from '../layer/layer';
import { DrawingSurface, DrawOptions } from '../layer/drawing-surface';
import { PointData } from 'pixi.js';
import { Rect } from '../layer/rect';

export class CanvasLayer implements Layer {
  readonly id: string;
  readonly name: string;
  private readonly surface: DrawingSurface;

  constructor(id: string, name: string, surface: DrawingSurface) {
    this.id = id;
    this.name = name;
    this.surface = surface;
  }

  drawLine(from: PointData, to: PointData, drawOptions: DrawOptions): void {
    this.surface.drawLine(from, to, drawOptions);
  }

  clearRect(rect: Rect): void {
    this.surface.clearRect(rect);
  }
}
