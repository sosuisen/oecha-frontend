import { PointData, Sprite } from 'pixi.js';
import { Layer } from './layer';
import { DrawingSurface, DrawOptions } from './drawing-surface';
import { Rect } from './rect';

export class TextureLayer implements Layer {
  readonly id: string;
  readonly name: string;
  readonly layerSprite: Sprite;
  private readonly surface: DrawingSurface;

  constructor(
    id: string,
    name: string,
    surface: DrawingSurface,
    layerSprite: Sprite,
  ) {
    this.id = id;
    this.name = name;
    this.surface = surface;
    this.layerSprite = layerSprite;
  }

  drawLine(from: PointData, to: PointData, drawOptions: DrawOptions): void {
    this.surface.drawLine(from, to, drawOptions);
  }

  clearRect(rect: Rect): void {
    this.surface.clearRect(rect);
  }
}
