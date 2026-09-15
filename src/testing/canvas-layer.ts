import { Layer } from '../layer/layer';
import { DrawLine, DrawOptions } from '../layer/draw-line';
import { PointData } from 'pixi.js';
import { Rect } from '../layer/rect';

export class CanvasLayer implements Layer {
  readonly id: string;
  private readonly drawLineDelegate: DrawLine;

  constructor(id: string, drawLineDelegate: DrawLine) {
    this.id = id;
    this.drawLineDelegate = drawLineDelegate;
  }

  drawLine(from: PointData, to: PointData, drawOptions: DrawOptions): void {
    this.drawLineDelegate.draw(from, to, drawOptions);
  }

  clearRect(rect: Rect): void {
    this.drawLineDelegate.clearRect(rect);
  }
}
