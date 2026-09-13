import { Layer } from '../layer';

export class CanvasLayer implements Layer {
  private id: string;
  constructor(id: string) {
    this.id = id;
  }

  getId(): string {
    return this.id;
  }
}
