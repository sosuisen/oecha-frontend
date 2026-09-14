import { describe, it, expect } from 'vitest';
import { SizeSettings } from './size-settings';

describe('size-settings', () => {
  // ツールサイズを変更、取得することができる
  it('should be able to change and get the tool size', () => {
    const sizeSettings = new SizeSettings();
    sizeSettings.set(10);
    expect(sizeSettings.get()).toBe(10);
  });

  // 初期値、最小値、最大値を設定することができる
  it('should be able to set initial, minimum, and maximum values', () => {
    const sizeSettings = new SizeSettings(10, 5, 50);
    expect(sizeSettings.get()).toBe(10);
    expect(sizeSettings.getMin()).toBe(5);
    expect(sizeSettings.getMax()).toBe(50);
  });

  // 最小値と最大値の間に収まらない初期値は、例外を投げる
  it('should throw an error if the initial value is outside the min and max range', () => {
    expect(() => new SizeSettings(0, 5, 50)).toThrow();
    expect(() => new SizeSettings(60, 5, 50)).toThrow();
  });

  // 最小値未満の値を設定しようとすると、最小値になる。
  it('should set the value to the minimum if a value below the minimum is set', () => {
    const sizeSettings = new SizeSettings(10, 1, 100);
    sizeSettings.set(0);
    expect(sizeSettings.get()).toBe(1);
  });

  // 最大値を超える値を設定しようとすると、最大値になる。
  it('should set the value to the maximum if a value above the maximum is set', () => {
    const sizeSettings = new SizeSettings(10, 1, 100);
    sizeSettings.set(101);
    expect(sizeSettings.get()).toBe(100);
  });

  // 値が変化したときにイベントが発火する
  it('should emit change event when the value is changed', () => {
    const sizeSettings = new SizeSettings(10, 1, 100);
    let currentValue: number | null = null;
    sizeSettings.on('change', value => (currentValue = value));
    sizeSettings.set(20);
    expect(currentValue).toBe(20);
  });
});
