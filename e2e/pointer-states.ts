import type { Locator } from '@playwright/test';
import { contrastRatio } from './contrast';
import { type Paint, readPaint } from './paint';

export interface PointerStates {
  readonly rest: Paint;
  readonly hover: number;
  readonly pressed: number;
}

const AWAY_FROM_CONTROLS = { x: 0, y: 0 };
const NO_CHANGE = 1;

function strongestChange(from: Paint, to: Paint): number {
  const border =
    from.border === null || to.border === null ? NO_CHANGE : contrastRatio(from.border, to.border);
  return Math.max(contrastRatio(from.fill, to.fill), contrastRatio(from.text, to.text), border);
}

export async function pointerStates(target: Locator): Promise<PointerStates> {
  const mouse = target.page().mouse;
  await target.scrollIntoViewIfNeeded();
  await mouse.move(AWAY_FROM_CONTROLS.x, AWAY_FROM_CONTROLS.y);
  const rest = await readPaint(target);
  await target.hover();
  const hovered = await readPaint(target);
  await mouse.down();
  const pressed = await readPaint(target);
  await mouse.move(AWAY_FROM_CONTROLS.x, AWAY_FROM_CONTROLS.y);
  await mouse.up();
  return {
    rest,
    hover: strongestChange(rest, hovered),
    pressed: strongestChange(rest, pressed),
  };
}
