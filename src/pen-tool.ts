import { SizeSettings } from './size-settings';
import { PenCommand } from './pen-command';
import { Layer } from './layer';
import { Tool } from './tool';
import { ToolId } from './tool-id';

export class PenTool implements Tool {
  readonly id: ToolId = ToolId.Pen;
  readonly label: string = 'Pen';
  readonly sizeSettings: SizeSettings = new SizeSettings(2, 1, 100);
  private color: number = 0xffffff; // デフォルトの色は白

  public getColor(): number {
    return this.color;
  }

  createCommand(layer: Layer): PenCommand {
    const command = new PenCommand(layer);
    command.setSize(this.sizeSettings.get());
    return command;
  }
}
