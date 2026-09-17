import { PointData } from 'pixi.js';
import { Rect } from './rect';
/**
 * DrawOptions
 * @param blendMode - The blend mode to use when drawing the line
 * @param color - The color of the line in hexadecimal format (e.g., 0xff0000 for red)
 * @param size - The size of the line
 */
export type DrawOptions = { blendMode: string; color: number; size: number };

export interface DrawingSurface {
  drawLine(p1: PointData, p2: PointData, drawOptions: DrawOptions): void;
  clearRect(rect: Rect): void;
}
