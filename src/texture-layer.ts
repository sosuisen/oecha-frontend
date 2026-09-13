import { Layer } from './layer';

export class TextureLayer implements Layer {
  private id: string;
  constructor(id: string) {
    this.id = id;
  }

  getId(): string {
    return this.id;
  }
}
