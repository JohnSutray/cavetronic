/**
 * Конвертирует яркость в цвет
 */
export function brightnessToColor(brightness: number): number {
  const minBrightness = 0.05;
  const adjustedBrightness = minBrightness + brightness * (1 - minBrightness);
  const green = Math.floor(adjustedBrightness * 255);

  return (green << 8);
}
