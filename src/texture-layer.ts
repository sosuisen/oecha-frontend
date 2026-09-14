import { PointData } from 'pixi.js';
import { Layer } from './layer';
import { DrawLine, DrawOptions } from './draw-line';

export class TextureLayer implements Layer {
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
