import { PointData } from 'pixi.js';
import { Layer } from './layer';
import { DrawLine, DrawOptions } from './draw-line';
import { Rect } from './rect';

export class TextureLayer implements Layer {
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
