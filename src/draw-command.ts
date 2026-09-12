export abstract class DrawCommand {
  abstract execute(): void;
  abstract onPointerDown(event: PointerEvent): void;
  abstract onPointerMove(event: PointerEvent): void;
  abstract onPointerUp(event: PointerEvent): void;
}
