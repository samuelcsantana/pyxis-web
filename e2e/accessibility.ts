import { expect, type Page } from '@playwright/test';
import axe from 'axe-core';

const AXE_TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice'];
const ANY_TITLE = /\S/;

async function finishedMoving(page: Page): Promise<void> {
  await page.evaluate(() =>
    Promise.all(
      document
        .getAnimations()
        .filter((animation) => {
          const target =
            animation.effect instanceof KeyframeEffect ? animation.effect.target : null;
          return (
            (animation.playState === 'running' || animation.pending) &&
            animation.effect?.getComputedTiming().endTime !== Infinity &&
            target?.checkVisibility() === true
          );
        })
        .map((animation) =>
          animation.finished.then(
            () => undefined,
            () => undefined,
          ),
        ),
    ),
  );
}

export async function axeViolations(page: Page): Promise<string[]> {
  await expect(page).toHaveTitle(ANY_TITLE);
  await finishedMoving(page);
  await page.addScriptTag({ content: axe.source });
  return page.evaluate(async (tags) => {
    const runner = (window as unknown as { axe: typeof axe }).axe;
    const results = await runner.run(document, { runOnly: { type: 'tag', values: tags } });
    return results.violations.map(
      (violation) => `${violation.id}: ${violation.nodes[0]?.html ?? '(no node)'}`,
    );
  }, AXE_TAGS);
}

export async function focusedElementIsUncovered(page: Page): Promise<boolean> {
  return page.evaluate(() => {
    const focused = document.activeElement;
    if (focused === null || focused === document.body) {
      return false;
    }
    const box = focused.getBoundingClientRect();
    const topmost = document.elementFromPoint(box.left + box.width / 2, box.top + box.height / 2);
    return topmost !== null && focused.contains(topmost);
  });
}

export async function sidewaysOverflow(page: Page): Promise<number> {
  return page.evaluate(() =>
    Math.max(0, document.documentElement.scrollWidth - document.documentElement.clientWidth),
  );
}
