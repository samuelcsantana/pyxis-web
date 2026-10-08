import { expect, test } from '@playwright/test';

const STORE_ID = '6f1d3c2a-8b4e-4f7a-9c1d-2e3f4a5b6c7d';
const CHART_SCREENS = [
  {
    title: 'Overview',
    path: 'overview',
    panel: 'Activity per day',
    summary: /^Area chart of /,
    mark: 'path[stroke="var(--color-sky)"]',
  },
  {
    title: 'Acquisition',
    path: 'acquisition',
    panel: 'Visits by channel',
    summary: /^Stacked bar chart of /,
    mark: 'rect',
  },
] as const;

test.describe('a chart screen before its scripts run', () => {
  test.beforeEach(async ({ page }) => {
    await page.route('**/_next/static/**/*.js', (route) => route.abort());
  });

  for (const screen of CHART_SCREENS) {
    test(`draws the ${screen.title} chart from the server HTML`, async ({ page }) => {
      await page.goto(`/${STORE_ID}/${screen.path}`);

      const figure = page
        .getByRole('region', { name: screen.panel })
        .getByRole('img', { name: screen.summary });
      await expect(figure.locator('svg')).toBeVisible();
      await expect(figure.locator(screen.mark).first()).toBeVisible();
    });

    test(`keeps ${screen.title} as wide as the phone`, async ({ page, isMobile }) => {
      test.skip(!isMobile, 'only a phone could be pushed wider than its screen');
      const phoneWidth = page.viewportSize()?.width ?? 0;

      await page.goto(`/${STORE_ID}/${screen.path}`);
      await expect(page.getByRole('heading', { level: 1, name: screen.title })).toBeVisible();

      expect(await page.evaluate(() => window.innerWidth)).toBe(phoneWidth);
      expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(
        phoneWidth,
      );
    });
  }
});
