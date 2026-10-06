import { Application, Container, Rectangle } from 'pixi.js';

export class CompositeColorPicker {
  private readonly app: Application;
  private readonly backgroundColor: number;
  private readonly container: Container;

  constructor(app: Application, backgroundColor: number, container: Container) {
    this.app = app;
    this.backgroundColor = backgroundColor;
    this.container = container;
  }

  getColorAt(x: number, y: number): number {
    const { pixels } = this.app.renderer.extract.pixels({
      target: this.container,
      frame: new Rectangle(Math.floor(x), Math.floor(y), 1, 1),
      clearColor: this.backgroundColor,
    });
    const [r, g, b] = pixels;
    return (r << 16) | (g << 8) | b;
  }
}
