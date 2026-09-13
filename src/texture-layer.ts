import { PointData } from 'pixi.js';
import { Layer } from './layer';
import { DrawLine } from './draw-line';

export class TextureLayer implements Layer {
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
