import { ToolId } from './tool-id';
import { SizeSettings } from './size-settings';
import { DrawCommand } from '../command/draw-command';
import { Layer } from '../layer/layer';

export interface Tool {
  readonly id: ToolId;
  readonly label: string;
  readonly sizeSettings: SizeSettings;
  createCommand(layer: Layer): DrawCommand;
}
