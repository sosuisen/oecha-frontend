export function getCssRgb(color: number): string {
  if (color < 0 || color > 0xffffff) {
    throw new Error(
      'Invalid color value. Must be a 24-bit integer (0x000000 to 0xFFFFFF).',
    );
  }
  const r = (color >> 16) & 0xff;
  const g = (color >> 8) & 0xff;
  const b = color & 0xff;
  return `rgb(${r}, ${g}, ${b})`;
}
