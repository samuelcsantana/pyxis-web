import type { Locator } from '@playwright/test';
import { flatten, type Rgb, type Rgba } from './contrast';

interface RawPaint {
  readonly own: Rgba;
  readonly behindFromTop: readonly Rgba[];
  readonly text: Rgba;
  readonly border: Rgba | null;
  readonly underline: Rgba | null;
  readonly outline: Rgba;
  readonly outlineStyle: string;
  readonly outlineWidth: number;
  readonly cursor: string;
  readonly opacity: number;
}

export interface Paint {
  readonly fill: Rgb;
  readonly behind: Rgb;
  readonly text: Rgb;
  readonly border: Rgb | null;
  readonly underline: Rgb | null;
  readonly outline: Rgb;
  readonly outlineStyle: string;
  readonly outlineWidth: number;
  readonly cursor: string;
  readonly opacity: number;
}

export async function readPaint(target: Locator): Promise<Paint> {
  const raw = await target.evaluate(async (element): Promise<RawPaint> => {
    await Promise.all(element.getAnimations().map((animation) => animation.finished));
    const canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;
    const context = canvas.getContext('2d', { willReadFrequently: true });
    if (context === null) {
      throw new Error('This browser has no 2D canvas to read colors with.');
    }
    const bytes = (color: string): [number, number, number, number] => {
      context.clearRect(0, 0, 1, 1);
      context.fillStyle = color;
      context.fillRect(0, 0, 1, 1);
      const [red = 0, green = 0, blue = 0, alpha = 0] = context.getImageData(0, 0, 1, 1).data;
      return [red, green, blue, alpha];
    };
    const opaque = 255;
    const behindFromTop: [number, number, number, number][] = [];
    for (let node = element.parentElement; node !== null; node = node.parentElement) {
      const layer = bytes(getComputedStyle(node).backgroundColor);
      if (layer[3] > 0) {
        behindFromTop.push(layer);
      }
      if (layer[3] === opaque) {
        break;
      }
    }
    const style = getComputedStyle(element);
    const sides = ['top', 'right', 'bottom', 'left']
      .map((side) => ({
        color: style.getPropertyValue(`border-${side}-color`),
        style: style.getPropertyValue(`border-${side}-style`),
        width: Number.parseFloat(style.getPropertyValue(`border-${side}-width`)),
      }))
      .filter((side) => side.style !== 'none' && side.width > 0)
      .toSorted((one, other) => other.width - one.width);
    const [widest] = sides;
    return {
      own: bytes(style.backgroundColor),
      behindFromTop,
      text: bytes(style.color),
      border: widest === undefined ? null : bytes(widest.color),
      underline: style.textDecorationLine.includes('underline')
        ? bytes(style.textDecorationColor)
        : null,
      outline: bytes(style.outlineColor),
      outlineStyle: style.outlineStyle,
      outlineWidth: Number.parseFloat(style.outlineWidth),
      cursor: style.cursor,
      opacity: Number.parseFloat(style.opacity),
    };
  });
  const [red, green, blue] = raw.outline;
  const fillLayers = [raw.own, ...raw.behindFromTop];
  return {
    fill: flatten(fillLayers),
    behind: flatten(raw.behindFromTop),
    text: flatten([raw.text, ...fillLayers]),
    border: raw.border === null ? null : flatten([raw.border, ...fillLayers]),
    underline: raw.underline === null ? null : flatten([raw.underline, ...fillLayers]),
    outline: [red, green, blue],
    outlineStyle: raw.outlineStyle,
    outlineWidth: raw.outlineWidth,
    cursor: raw.cursor,
    opacity: raw.opacity,
  };
}
