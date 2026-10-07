import { expect, test } from '@playwright/test';

const STORE_ID = '6f1d3c2a-8b4e-4f7a-9c1d-2e3f4a5b6c7d';
const CHART_SCREENS = [
  { title: 'Overview', path: 'overview' },
  { title: 'Acquisition', path: 'acquisition' },
] as const;

test.describe('a chart screen before its scripts run', () => {
  test.skip(({ isMobile }) => !isMobile, 'the chart placeholder only overflows a phone');

  for (const screen of CHART_SCREENS) {
    test(`keeps ${screen.title} as wide as the phone`, async ({ page }) => {
      const phoneWidth = page.viewportSize()?.width ?? 0;
      await page.route('**/_next/static/**/*.js', (route) => route.abort());

      await page.goto(`/${STORE_ID}/${screen.path}`);
      await expect(page.getByRole('heading', { level: 1, name: screen.title })).toBeVisible();

      expect(await page.evaluate(() => window.innerWidth)).toBe(phoneWidth);
      expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(
        phoneWidth,
      );
    });
  }
});
