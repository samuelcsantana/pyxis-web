import { expect, type Page, test } from '@playwright/test';
import { axeViolations } from './accessibility';

const STORE_ID = '6f1d3c2a-8b4e-4f7a-9c1d-2e3f4a5b6c7d';
const NEXT_QUESTION = '00:31';
const NOTHING = { times: [], more: false };

interface Answer {
  readonly asOf: number;
  readonly activeVisits: number;
  readonly visits: { readonly times: readonly number[]; readonly more: boolean };
  readonly conversions: { readonly times: readonly number[]; readonly more: boolean } | null;
  readonly namedEvents: { readonly times: readonly number[]; readonly more: boolean };
  readonly failedRequests: { readonly times: readonly number[]; readonly more: boolean };
}

function answerAt(asOf: number, changes: Partial<Answer> = {}): Answer {
  return {
    asOf,
    activeVisits: 2,
    visits: NOTHING,
    conversions: NOTHING,
    namedEvents: NOTHING,
    failedRequests: NOTHING,
    ...changes,
  };
}

async function answerArrivals(page: Page, answers: Answer[]): Promise<string[]> {
  const asked: string[] = [];
  await page.route('**/arrivals?*', async (route) => {
    asked.push(route.request().url());
    const answer = answers.length > 1 ? answers.shift() : answers[0];
    await route.fulfill({ json: answer, headers: { 'cache-control': 'private, no-store' } });
  });
  return asked;
}

function menu(page: Page) {
  return page.getByRole('navigation', { name: 'Main navigation', includeHidden: true });
}

function screenLink(page: Page, screen: string) {
  return menu(page).locator(`a[href^="/${STORE_ID}/${screen}"]`);
}

test('counts on the menu what arrived after the first answer, never on the screen shown', async ({
  page,
  isMobile,
}) => {
  const start = Date.now();
  const asked = await answerArrivals(page, [
    answerAt(start),
    answerAt(start + 30_000, {
      visits: { times: [start + 20_000], more: false },
      namedEvents: { times: [start + 10_000, start + 5_000], more: false },
    }),
  ]);
  await page.clock.install({ time: start });
  await page.goto(`/${STORE_ID}/overview`);
  await expect(page.getByRole('main')).not.toHaveAttribute('aria-busy');
  await expect.poll(() => asked.length).toBe(1);
  await expect(
    menu(page).getByRole('link', { name: 'Visits', exact: true, includeHidden: true }),
  ).toBeAttached();

  await page.clock.fastForward(NEXT_QUESTION);

  if (isMobile) {
    await page.getByRole('button', { name: 'Open menu, there is news' }).click();
  }
  await expect(screenLink(page, 'visits')).toHaveAccessibleName(/^Visits\s*, 1 new visit$/);
  await expect(screenLink(page, 'features')).toHaveAccessibleName(/^Features\s*, 2 new events$/);
  await expect(menu(page).getByRole('link', { name: 'Overview', exact: true })).toHaveAttribute(
    'aria-current',
    'page',
  );
  await expect(menu(page).getByText('2', { exact: true })).toBeVisible();
  expect(await axeViolations(page)).toEqual([]);
});

test('asks nothing while the period does not include today', async ({ page }) => {
  const asked = await answerArrivals(page, [answerAt(Date.now())]);
  await page.clock.install();
  await page.goto(`/${STORE_ID}/overview?from=2026-09-01&to=2026-09-30`);
  await expect(page.getByRole('main')).not.toHaveAttribute('aria-busy');

  await page.clock.fastForward(NEXT_QUESTION);

  expect(asked).toEqual([]);
});
