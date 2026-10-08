import type { Page } from '@playwright/test';
import axe from 'axe-core';

const AXE_TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice'];

export async function axeViolations(page: Page): Promise<string[]> {
  await page.addScriptTag({ content: axe.source });
  return page.evaluate(async (tags) => {
    const runner = (window as unknown as { axe: typeof axe }).axe;
    const results = await runner.run(document, { runOnly: { type: 'tag', values: tags } });
    return results.violations.map(
      (violation) => `${violation.id}: ${violation.nodes[0]?.html ?? '(no node)'}`,
    );
  }, AXE_TAGS);
}

export async function sidewaysOverflow(page: Page): Promise<number> {
  return page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  );
}
