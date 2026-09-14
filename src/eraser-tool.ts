import { SizeSettings } from './size-settings';
import { EraserCommand } from './eraser-command';
import { Layer } from './layer';
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
}
