import { DrawCommand } from './draw-command';

export class PenCommand extends DrawCommand {
  static readonly DEFAULT_COLOR: number = 0xff8000;

  private points: { x: number; y: number }[] = [];
  private nextSegment: number = 0;

  public getPoints(): { x: number; y: number }[] {
    return this.points;
  }

  public addPoint(x: number, y: number): void {
    this.points.push({ x: x, y: y });
  }

  public onPointerDown(event: PointerEvent): void {
    this.points.push({ x: event.clientX, y: event.clientY });
  }

  public onPointerMove(event: PointerEvent): void {
    this.points.push({ x: event.clientX, y: event.clientY });
  }

  public onPointerUp(): void {}

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
