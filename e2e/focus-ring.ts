import type { Locator } from '@playwright/test';
import { contrastRatio, flatten, type Rgba } from './contrast';

interface RingReading {
  readonly focusVisible: boolean;
  readonly outlineStyle: string;
  readonly outlineWidth: number;
  readonly outline: Rgba;
  readonly surfaceFromTop: readonly Rgba[];
}

export interface FocusRing {
  readonly focusVisible: boolean;
  readonly drawn: boolean;
  readonly contrast: number;
}

const MIN_RING_WIDTH_PX = 2;

export async function focusRing(target: Locator, ring: Locator = target): Promise<FocusRing> {
  const page = target.page();
  await target.waitFor({ state: 'visible' });
  await page.keyboard.press('Tab');
  await page.waitForFunction(() => document.activeElement !== document.body);
  await target.focus();
  const focusVisible = await target.evaluate((element) => element.matches(':focus-visible'));
  const reading = await ring.evaluate(
    async (element): Promise<Omit<RingReading, 'focusVisible'>> => {
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
      const surfaceFromTop: [number, number, number, number][] = [];
      for (let node = element.parentElement; node !== null; node = node.parentElement) {
        const layer = bytes(getComputedStyle(node).backgroundColor);
        if (layer[3] > 0) {
          surfaceFromTop.push(layer);
        }
        if (layer[3] === opaque) {
          break;
        }
      }
      const style = getComputedStyle(element);
      return {
        outlineStyle: style.outlineStyle,
        outlineWidth: Number.parseFloat(style.outlineWidth),
        outline: bytes(style.outlineColor),
        surfaceFromTop,
      };
    },
  );
  const [red, green, blue] = reading.outline;
  return {
    focusVisible,
    drawn: reading.outlineStyle !== 'none' && reading.outlineWidth >= MIN_RING_WIDTH_PX,
    contrast: contrastRatio([red, green, blue], flatten(reading.surfaceFromTop)),
  };
}
