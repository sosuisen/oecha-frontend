export interface DrawCommand {
  drawNextSegment(): void;
  execute(): void;
  addPoint(x: number, y: number): void;
  onPointerDown(event: PointerEvent): void;
  onPointerMove(event: PointerEvent): void;
  onPointerUp(event: PointerEvent): void;
}
