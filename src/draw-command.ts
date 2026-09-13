export interface DrawCommand {
  drawNextSegment(): void;
  execute(): void;
  addPoint(x: number, y: number): void;
  setSize(size: number): void;
  getSize(): number;
  onPointerDown(event: PointerEvent): void;
  onPointerMove(event: PointerEvent): void;
  onPointerUp(event: PointerEvent): void;
}
