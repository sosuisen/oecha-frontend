import { SizeSettings } from './size-settings';
import { EraserCommand } from '../command/eraser-command';
import { Layer } from '../layer/layer';
import { Tool } from './tool';
import { ToolId } from './tool-id';

export class EraserTool implements Tool {
  readonly id: ToolId = ToolId.Eraser;
  readonly label: string = 'Eraser';
  readonly sizeSettings: SizeSettings = new SizeSettings(10, 1, 100);

  createCommand(layer: Layer): EraserCommand {
    const command = new EraserCommand(layer);
    command.setSize(this.sizeSettings.get());
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
