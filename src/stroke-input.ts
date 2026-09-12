import { Command } from './command';

export class StrokeInput implements Command {
  private points: { x: number; y: number }[] = [];
  private canvas: HTMLCanvasElement;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.canvas.addEventListener('pointerdown', e => {
      this.onPointerDown(e);
    });
    this.canvas.addEventListener('pointermove', e => {
      this.onPointerMove(e);
    });
    this.canvas.addEventListener('pointerup', () => {
      this.onPointerUp();
    });
  }

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
