import { Layer } from '../layer';
import { DrawLine } from '../draw-line';
import { PointData } from 'pixi.js';

export class CanvasLayer implements Layer {
  private id: string;
  private drawLineDelegate: DrawLine;
  constructor(id: string, drawLineDelegate: DrawLine) {
    this.id = id;
    this.drawLineDelegate = drawLineDelegate;
  }

  public getId(): string {
    return this.id;
  }
  public drawLine(from: PointData, to: PointData, color: number): void {
    this.drawLineDelegate.draw(from, to, { blendMode: 'normal', color });
  }
}
