import { PointData } from 'pixi.js';
/**
 * DrawOptions
 * @param blendMode - The blend mode to use when drawing the line
 * @param color - The color of the line in hexadecimal format (e.g., 0xff0000 for red)
 */
export type DrawOptions = { blendMode: string; color: number };

export interface DrawLine {
  draw(p1: PointData, p2: PointData, drawOptions: DrawOptions): void;
}
