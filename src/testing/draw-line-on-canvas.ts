import { getCssRgb } from '../color-utils';
import { DrawLine, DrawOptions } from '../draw-line';
import { PointData } from 'pixi.js';

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
   * @param drawOptions - Options for drawing the line
   */
  public draw(p1: PointData, p2: PointData, drawOptions: DrawOptions): void {
    const lineWidth = 2;
    let color = drawOptions.color;
    if (drawOptions.blendMode === 'erase') {
      color = 0xffffff;
      this.ctx.globalCompositeOperation = 'destination-out';
    }

    if (p1.x === p2.x && p1.y === p2.y) {
      this.ctx.beginPath();
      this.ctx.fillStyle = getCssRgb(color);
      this.ctx.arc(p1.x + 0.5, p1.y + 0.5, lineWidth / 2, 0, Math.PI * 2);
      this.ctx.fill();
    } else {
      this.ctx.beginPath();
      this.ctx.lineCap = 'round';
      this.ctx.moveTo(p1.x + 0.5, p1.y + 0.5);
      this.ctx.lineTo(p2.x + 0.5, p2.y + 0.5);
      this.ctx.strokeStyle = getCssRgb(color);
      this.ctx.lineWidth = lineWidth;
      this.ctx.stroke();
    }

    if (drawOptions.blendMode === 'erase') {
      this.ctx.globalCompositeOperation = 'source-over';
    }
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
