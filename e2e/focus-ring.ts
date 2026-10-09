import type { Locator } from '@playwright/test';
import { contrastRatio } from './contrast';
import { readPaint } from './paint';

export interface FocusRing {
  readonly focusVisible: boolean;
  readonly drawn: boolean;
  readonly contrast: number;
  readonly steady: boolean;
}

const MIN_RING_WIDTH_PX = 2;

async function ringKeepsItsColorFromTheFirstFrame(
  target: Locator,
  ring: Locator,
): Promise<boolean> {
  const ringElement = await ring.elementHandle();
  return target.evaluate((element, painted) => {
    const settle = () => {
      painted.getAnimations().forEach((animation) => {
        animation.finish();
      });
      return getComputedStyle(painted).outlineColor;
    };
    if (!(element instanceof HTMLElement)) {
      return false;
    }
    element.blur();
    settle();
    element.focus();
    const firstFrame = getComputedStyle(painted).outlineColor;
    return settle() === firstFrame;
  }, ringElement);
}

export async function focusRing(target: Locator, ring: Locator = target): Promise<FocusRing> {
  const page = target.page();
  await target.waitFor({ state: 'visible' });
  await page.keyboard.press('Tab');
  await page.waitForFunction(() => document.activeElement !== document.body);
  await target.focus();
  const focusVisible = await target.evaluate((element) => element.matches(':focus-visible'));
  const paint = await readPaint(ring);
  const steady = await ringKeepsItsColorFromTheFirstFrame(target, ring);
  return {
    focusVisible,
    drawn: paint.outlineStyle !== 'none' && paint.outlineWidth >= MIN_RING_WIDTH_PX,
    contrast: contrastRatio(paint.outline, paint.behind),
    steady,
  };
}
