import { expect, test } from '@playwright/test';
import { axeViolations, sidewaysOverflow } from './accessibility';

for (const colorScheme of ['light', 'dark'] as const) {
  test.describe(`home page, ${colorScheme} theme`, () => {
    test.use({ colorScheme });

    test('renders the brand and the repositories', async ({ page }) => {
      await page.goto('/');

      await expect(
        page.getByRole('heading', { level: 1, name: 'Privacy-first product analytics' }),
      ).toBeVisible();
      await expect(
        page.getByRole('navigation', { name: 'Project repositories' }).getByRole('link'),
      ).toHaveCount(3);
    });

    test('has no WCAG 2.2 A or AA violation', async ({ page }) => {
      await page.goto('/');

      expect(await axeViolations(page)).toEqual([]);
    });

    test('never scrolls sideways', async ({ page }) => {
      await page.goto('/');

      expect(await sidewaysOverflow(page)).toBe(0);
    });
  });
}

test('sends the security headers', async ({ request }) => {
  const response = await request.get('/');

  expect(response.headers()['content-security-policy']).toContain("frame-ancestors 'none'");
  expect(response.headers()['x-content-type-options']).toBe('nosniff');
  expect(response.headers()['x-powered-by']).toBeUndefined();
});
