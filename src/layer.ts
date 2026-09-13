import { PointData } from 'pixi.js';

export interface Layer {
  getId(): string;
  drawLine(from: PointData, to: PointData, color: number): void;
}
