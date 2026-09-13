import { getCssRgb } from '../color-utils';
import { DrawLine } from '../draw-line';

type Point = { x: number; y: number };

export class DrawLineOnCanvas implements DrawLine {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    const ctx = this.canvas.getContext('2d');
    if (!ctx) {
      throw new Error('Failed to get 2D context from texture');
    }
    this.ctx = ctx;
  }

  /**
   * Draws a line segment on the canvas.
   * @param p1 - Starting point of the line
   * @param p2 - Ending point of the line
   * @param color - 24-bit integer (0x000000 to 0xFFFFFF)
   */
  public draw(p1: Point, p2: Point, color: number): void {
    const lineWidth = 2;
    if (p1.x === p2.x && p1.y === p2.y) {
      this.ctx.beginPath();
      this.ctx.fillStyle = getCssRgb(color);
      this.ctx.arc(p1.x + 0.5, p1.y + 0.5, lineWidth / 2, 0, Math.PI * 2);
      this.ctx.fill();
      return;
    }
    this.ctx.beginPath();
    this.ctx.lineCap = 'round';
    this.ctx.moveTo(p1.x + 0.5, p1.y + 0.5);
    this.ctx.lineTo(p2.x + 0.5, p2.y + 0.5);
    this.ctx.strokeStyle = getCssRgb(color);
    this.ctx.lineWidth = lineWidth;
    this.ctx.stroke();
  }
  /**
   * Gets the color of a pixel at the specified coordinates.
   * @param x - The x-coordinate of the pixel
   * @param y - The y-coordinate of the pixel
   * @returns The color of the pixel as a 24-bit integer (0x000000 to 0xFFFFFF)
   */
  public getPixel(x: number, y: number): number {
    const imageData = this.ctx.getImageData(x, y, 1, 1);
    const [r, g, b] = imageData.data;
    return (r << 16) | (g << 8) | b;
  }
}
