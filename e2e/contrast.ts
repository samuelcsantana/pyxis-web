export type Rgb = readonly [number, number, number];
export type Rgba = readonly [number, number, number, number];

export const MIN_TEXT_CONTRAST = 4.5;
export const MIN_NON_TEXT_CONTRAST = 3;
export const MIN_STATE_CHANGE = 1.3;

const HEX_COLOR = /^#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i;
const CHANNEL_MAX = 255;
const WHITE: Rgb = [CHANNEL_MAX, CHANNEL_MAX, CHANNEL_MAX];
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

function over(top: Rgba, bottom: Rgb): Rgb {
  const [red, green, blue, alpha] = top;
  const opacity = alpha / CHANNEL_MAX;
  const blend = (front: number, back: number) => front * opacity + back * (1 - opacity);
  return [blend(red, bottom[0]), blend(green, bottom[1]), blend(blue, bottom[2])];
}

export function flatten(layersFromTop: readonly Rgba[]): Rgb {
  return layersFromTop.reduceRight<Rgb>((below, layer) => over(layer, below), WHITE);
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
