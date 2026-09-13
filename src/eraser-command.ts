import { DrawCommand } from './draw-command';
import { Layer } from './layer';

export class EraserCommand implements DrawCommand {
  static readonly DEFAULT_COLOR: number = 0xffffff;

  private targetLayer: Layer;

  private points: { x: number; y: number }[] = [];
  private nextSegment: number = 0;
  private size: number = 10;

  constructor(layer: Layer) {
    this.targetLayer = layer;
  }

  public getPoints(): { x: number; y: number }[] {
    return this.points;
  }

  public setSize(size: number): void {
    this.size = size;
  }

  public getSize(): number {
    return this.size;
  }

  public addPoint(x: number, y: number): void {
    this.points.push({ x, y });
  }

  public onPointerDown(event: PointerEvent): void {
    this.points.push({ x: event.clientX, y: event.clientY });
  }

  public onPointerMove(event: PointerEvent): void {
    this.points.push({ x: event.clientX, y: event.clientY });
    this.drawNextSegment();
  }

  public onPointerUp(event: PointerEvent): void {
    this.points.push({ x: event.clientX, y: event.clientY });
    this.drawNextSegment();
  }

  public drawNextSegment(): void {
    if (this.points.length < 2 || this.nextSegment >= this.points.length - 1) {
      return;
    }
    this.targetLayer.drawLine(
      this.points[this.nextSegment],
      this.points[this.nextSegment + 1],
      {
        blendMode: 'erase',
        color: EraserCommand.DEFAULT_COLOR,
        size: this.size,
      },
    );
    this.nextSegment++;
  }

  /**
   * Draw all segments of the stroke on the target layer.
   * It does not change the current segment index.
   */
  public execute(): void {
    if (this.points.length === 0) {
      return;
    }
    for (let i = 0; i < this.points.length - 1; i++) {
      this.targetLayer.drawLine(this.points[i], this.points[i + 1], {
        blendMode: 'erase',
        color: EraserCommand.DEFAULT_COLOR,
        size: this.size,
      });
    }
  }
}
