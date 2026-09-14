import { Container, Text } from 'pixi.js';

export class Info {
  private root: Container;
  private infoText: Text;

  constructor(root: Container) {
    this.root = root;
    this.infoText = new Text({
      text: 'Info',
      style: {
        fontSize: 24,
        fill: 0xffffff,
      },
    });
    this.infoText.position.set(10, 10);
  }

  setText(text: string) {
    this.infoText.text = text;
  }

  show() {
    this.root.addChild(this.infoText);
  }
}
