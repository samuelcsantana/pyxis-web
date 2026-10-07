export type Rgb = readonly [number, number, number];

export const MIN_NON_TEXT_CONTRAST = 3;

const HEX_COLOR = /^#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i;
const CHANNEL_MAX = 255;
const LINEAR_THRESHOLD = 0.04045;
const LINEAR_SLOPE = 12.92;
const GAMMA_OFFSET = 0.055;
const GAMMA_SCALE = 1.055;
const GAMMA = 2.4;
const RED_WEIGHT = 0.2126;
const GREEN_WEIGHT = 0.7152;
const BLUE_WEIGHT = 0.0722;
const FLARE = 0.05;

export function hexToRgb(hex: string): Rgb {
  const match = HEX_COLOR.exec(hex);
  if (match === null) {
    throw new RangeError(`Not a #rrggbb color: ${hex}`);
  }
  const [, red = '', green = '', blue = ''] = match;
  return [Number.parseInt(red, 16), Number.parseInt(green, 16), Number.parseInt(blue, 16)];
}

function linearChannel(channel: number): number {
  const value = channel / CHANNEL_MAX;
  return value <= LINEAR_THRESHOLD
    ? value / LINEAR_SLOPE
    : ((value + GAMMA_OFFSET) / GAMMA_SCALE) ** GAMMA;
}

export function relativeLuminance([red, green, blue]: Rgb): number {
  return (
    RED_WEIGHT * linearChannel(red) +
    GREEN_WEIGHT * linearChannel(green) +
    BLUE_WEIGHT * linearChannel(blue)
  );
}

export function contrastRatio(first: Rgb, second: Rgb): number {
  const one = relativeLuminance(first);
  const other = relativeLuminance(second);
  return (Math.max(one, other) + FLARE) / (Math.min(one, other) + FLARE);
}
