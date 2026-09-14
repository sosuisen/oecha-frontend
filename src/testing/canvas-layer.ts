import { Layer } from '../layer';
import { DrawLine, DrawOptions } from '../draw-line';
import { PointData } from 'pixi.js';

export class CanvasLayer implements Layer {
  readonly id: string;
  private readonly drawLineDelegate: DrawLine;
  constructor(id: string, drawLineDelegate: DrawLine) {
    this.id = id;
    this.drawLineDelegate = drawLineDelegate;
  }
  public drawLine(
    from: PointData,
    to: PointData,
    drawOptions: DrawOptions,
  ): void {
    this.drawLineDelegate.draw(from, to, drawOptions);
  }
}
