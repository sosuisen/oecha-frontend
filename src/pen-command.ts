import { DrawCommand } from './draw-command';

export class PenCommand extends DrawCommand {
  private points: { x: number; y: number }[] = [];

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

  public execute(): void {
    if (this.points.length === 0) {
      return;
    }
    const g = this.targetLayer.getGraphics();

    g.moveTo(this.points[0].x, this.points[0].y);
    for (let i = 1; i < this.points.length; i++) {
      g.lineTo(this.points[i].x, this.points[i].y);
    }
    g.stroke();
  }
}
