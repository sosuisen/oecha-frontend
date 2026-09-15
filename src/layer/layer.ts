import { PointData } from 'pixi.js';
import { DrawOptions } from './draw-line';
import { Rect } from './rect';

export interface Layer {
  readonly id: string;
  drawLine(from: PointData, to: PointData, drawOptions: DrawOptions): void;
  clearRect(rect: Rect): void;
}
