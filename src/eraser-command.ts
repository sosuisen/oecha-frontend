import { DrawCommand } from './draw-command';

export class EraserCommand implements DrawCommand {
  drawNextSegment(): void {
    throw new Error('Method not implemented.');
  }
  execute(): void {
    throw new Error('Method not implemented.');
  }
  addPoint(x: number, y: number): void {
    console.log(`EraserCommand.addPoint called with x=${x}, y=${y}`);
    throw new Error('Method not implemented.');
  }
  onPointerDown(event: PointerEvent): void {
    console.log(`EraserCommand.onPointerDown called with event: ${event}`);
    throw new Error('Method not implemented.');
  }
  onPointerMove(event: PointerEvent): void {
    console.log(`EraserCommand.onPointerMove called with event: ${event}`);
    throw new Error('Method not implemented.');
  }
  onPointerUp(event: PointerEvent): void {
    console.log(`EraserCommand.onPointerUp called with event: ${event}`);
    throw new Error('Method not implemented.');
  }
}
