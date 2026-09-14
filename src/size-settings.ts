import { EventEmitter } from 'pixi.js';

export class SizeSettings extends EventEmitter<{ change: [number] }> {
  private value: number;
  readonly min: number;
  readonly max: number;

  constructor(value: number = 1, min: number = 1, max: number = 100) {
    super();
    this.value = value;
    this.min = min;
    this.max = max;
    if (value < min || value > max) {
      throw new Error(
        `Initial value ${value} is out of range [${min}, ${max}]`,
      );
    }
  }

  get(): number {
    return this.value;
  }

  set(value: number): void {
    let newValue = value;
    if (value < this.min) {
      newValue = this.min;
    } else if (value > this.max) {
      newValue = this.max;
    }
    if (newValue !== this.value) {
      this.value = newValue;
      this.emit('change', this.value);
    }
  }
}
