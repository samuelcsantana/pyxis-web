import { expect, test } from '@playwright/test';
import { axeViolations } from './accessibility';

const STORE_ID = '6f1d3c2a-8b4e-4f7a-9c1d-2e3f4a5b6c7d';
const UNKNOWN_PROJECT_ID = '00000000-0000-4000-8000-000000000000';
const NOT_FOUND_TITLE = 'Page not found · Pyxis';

for (const colorScheme of ['light', 'dark'] as const) {
  test.describe(`not found pages, ${colorScheme} theme`, () => {
    test.use({ colorScheme });

    test('have no WCAG 2.2 A or AA violation', async ({ page }) => {
      for (const path of ['/nope', `/${UNKNOWN_PROJECT_ID}/overview`, `/${STORE_ID}/nope`]) {
        await page.goto(path);
        await expect(page.getByRole('heading', { level: 1 })).toHaveText('Page not found');

        expect(await axeViolations(page)).toEqual([]);
      }
    });
  });
}

test('names an unknown path in the title and its one heading', async ({ page }) => {
  const response = await page.goto('/nope');

  expect(response?.status()).toBe(404);
  await expect(page).toHaveTitle(NOT_FOUND_TITLE);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Page not found');
  await expect(page.getByRole('link', { name: 'Go to your projects' })).toHaveAttribute(
    'href',
    '/',
  );
});

test('names a project the admin may not read as not found, not as its screen', async ({ page }) => {
  const response = await page.goto(`/${UNKNOWN_PROJECT_ID}/overview`);

  expect(response?.status()).toBe(404);
  await expect(page).toHaveTitle(NOT_FOUND_TITLE);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Page not found');
  await expect(page.getByRole('navigation', { name: 'Main navigation' })).toHaveCount(0);
});

test('keeps the project shell around an unknown screen, and answers 404', async ({ page }) => {
  const response = await page.goto(`/${STORE_ID}/nope`);

  expect(response?.status()).toBe(404);
  await expect(page).toHaveTitle(NOT_FOUND_TITLE);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Page not found');
  await expect(page.getByRole('note')).toContainText('Demo data');
  await expect(
    page.getByRole('navigation', { name: 'Main navigation', includeHidden: true }),
  ).toBeAttached();
  await expect(page.getByRole('link', { name: 'Open the Overview' })).toHaveAttribute(
    'href',
    `/${STORE_ID}/overview`,
  );
});
