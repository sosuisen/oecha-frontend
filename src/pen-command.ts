import { DrawCommand } from './draw-command';
import { Layer } from './layer';

export class PenCommand implements DrawCommand {
  static readonly DEFAULT_COLOR: number = 0xff00ff;
  private targetLayer: Layer;

  private points: { x: number; y: number }[] = [];
  private nextSegment: number = 0;

  constructor(layer: Layer) {
    this.targetLayer = layer;
  }

  public getTargetLayer(): Layer {
    return this.targetLayer;
  }

  public getPoints(): { x: number; y: number }[] {
    return this.points;
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

  /**
   * Draw the next segment of the stroke
   */
  public drawNextSegment(): void {
    if (this.points.length < 2 || this.nextSegment >= this.points.length - 1) {
      return;
    }
    this.targetLayer.drawLine(
      this.points[this.nextSegment],
      this.points[this.nextSegment + 1],
      PenCommand.DEFAULT_COLOR,
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
      this.targetLayer.drawLine(
        this.points[i],
        this.points[i + 1],
        PenCommand.DEFAULT_COLOR,
      );
    }
  }
}
