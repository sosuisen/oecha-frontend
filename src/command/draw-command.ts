import { Command } from './command';

export interface DrawCommand extends Command {
  drawNextSegment(): void;
  addPoint(x: number, y: number): void;
  setSize(size: number): void;
  getSize(): number;
  onPointerDown(event: PointerEvent): void;
  onPointerMove(event: PointerEvent): void;
  onPointerUp(event: PointerEvent): void;
}
