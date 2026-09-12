import { DrawCommand } from './draw-command';

export class PenCommand extends DrawCommand {
  private points: { x: number; y: number }[] = [];

  public getPoints(): { x: number; y: number }[] {
    return this.points;
  }

  public onPointerDown(event: PointerEvent): void {
    this.points.push({ x: event.clientX, y: event.clientY });
  }

  public onPointerMove(event: PointerEvent): void {
    this.points.push({ x: event.clientX, y: event.clientY });
  }

  public onPointerUp(): void {}

  public execute(): void {
    // Implement the command execution logic here
  }
}
