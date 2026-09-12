import { Graphics } from 'pixi.js';

export class Layer {
  private id: string;
  private graphics: Graphics;

  constructor(id: string) {
    this.id = id;
    this.graphics = new Graphics();
  }

  public getId(): string {
    return this.id;
  }

  public getGraphics(): Graphics {
    return this.graphics;
  }
}
