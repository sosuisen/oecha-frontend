import { ToolId } from './tool-id';
import { SizeSettings } from './size-settings';
import { DrawCommand } from './draw-command';
import { Layer } from './layer';

export interface Tool {
  readonly id: ToolId;
  readonly label: string;
  readonly sizeSettings: SizeSettings;
  createCommand(layer: Layer): DrawCommand;
}
