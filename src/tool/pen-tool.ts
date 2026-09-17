import { SizeSettings } from './size-settings';
import { PenCommand } from '../command/pen-command';
import { Layer } from '../layer/layer';
import { Tool } from './tool';
import { ToolId } from './tool-id';

export class PenTool implements Tool {
  readonly id: ToolId = ToolId.Pen;
  readonly label: string = 'Pen';
  readonly sizeSettings: SizeSettings = new SizeSettings(2, 1, 100);
  private color: number = 0xffffff; // デフォルトの色は白

  getColor(): number {
    return this.color;
  }

  setColor(color: number): void {
    this.color = color;
  }

  createCommand(layer: Layer): PenCommand {
    const command = new PenCommand(layer);
    command.setSize(this.sizeSettings.get());
    command.setColor(this.color);
    return command;
  }

  onWheel(event: WheelEvent): void {
    const delta = Math.sign(event.deltaY);
    if (delta > 0) {
      this.sizeSettings.decrease();
    } else if (delta < 0) {
      this.sizeSettings.increase();
    }
  }
}
