import type { Locator } from '@playwright/test';
import { contrastRatio } from './contrast';
import { readPaint } from './paint';

export interface PointerStates {
  readonly hover: number;
  readonly pressed: number;
}

const AWAY_FROM_CONTROLS = { x: 0, y: 0 };

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
    hover: contrastRatio(hovered.fill, rest.fill),
    pressed: contrastRatio(pressed.fill, rest.fill),
  };
}
