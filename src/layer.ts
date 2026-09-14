import { PointData } from 'pixi.js';
import { DrawOptions } from './draw-line';

export interface Layer {
  readonly id: string;
  drawLine(from: PointData, to: PointData, drawOptions: DrawOptions): void;
}
