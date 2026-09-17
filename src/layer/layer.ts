import { PointData, Sprite } from 'pixi.js';
import { DrawingSurface, DrawOptions } from './drawing-surface';
import { Rect } from './rect';

export interface Layer {
  readonly id: string;
  readonly layerSprite: Sprite;
  getSurface(): DrawingSurface;
  drawLine(from: PointData, to: PointData, drawOptions: DrawOptions): void;
  clearRect(rect: Rect): void;
}
