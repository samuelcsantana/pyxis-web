import { expect, type Page, test } from '@playwright/test';
import { axeViolations, sidewaysOverflow } from './accessibility';

const STORE_ID = '6f1d3c2a-8b4e-4f7a-9c1d-2e3f4a5b6c7d';
const DOCS_ID = '0c9b8a7d-6e5f-4a3b-8c2d-1e0f9a8b7c6d';

async function openNavigation(page: Page, isMobile: boolean) {
  if (isMobile) {
    await page.getByRole('button', { name: 'Open menu' }).click();
  }
}

for (const colorScheme of ['light', 'dark'] as const) {
  test.describe(`overview, ${colorScheme} theme`, () => {
    test.use({ colorScheme });

    test('has no WCAG 2.2 A or AA violation and never scrolls sideways', async ({ page }) => {
      await page.goto(`/${STORE_ID}/overview`);
      await expect(page.getByRole('heading', { level: 1, name: 'Overview' })).toBeVisible();

      expect(await axeViolations(page)).toEqual([]);
      expect(await sidewaysOverflow(page)).toBe(0);
    });
  });
}

test('opens the first project from the root, with the demo banner', async ({ page }) => {
  await page.goto('/');

  await expect(page).toHaveURL(new RegExp(`/${STORE_ID}/overview$`));
  await expect(page.getByRole('note')).toContainText('Demo data');
  await expect(page.getByText('How Demo Store was used in the period')).toBeVisible();
});

test('writes the chosen period into the URL', async ({ page }) => {
  await page.goto(`/${STORE_ID}/overview`);
  const periods = page.getByRole('navigation', { name: 'Period' });

  await periods.getByRole('link', { name: '7 days' }).click();

  await expect(page).toHaveURL(/range=7d$/);
  await expect(periods.getByRole('link', { name: '7 days' })).toHaveAttribute(
    'aria-current',
    'true',
  );
});

test('applies a custom period through a plain form', async ({ page }) => {
  await page.goto(`/${STORE_ID}/overview`);

  await page.getByText('Custom', { exact: true }).click();
  await page.getByLabel('From', { exact: true }).fill('2026-08-01');
  await page.getByLabel('To', { exact: true }).fill('2026-08-31');
  await page.getByRole('button', { name: 'Apply' }).click();

  await expect(page).toHaveURL(/from=2026-08-01&to=2026-08-31$/);
  await expect(page.getByText('Aug 1 – Aug 31, 2026', { exact: true })).toBeVisible();
  await expect(page.getByText('Page views and named events, Aug 1 – Aug 31, 2026')).toBeVisible();
});

test('keeps a custom period form closed until asked for', async ({ page }) => {
  await page.goto(`/${STORE_ID}/overview?from=2026-08-01&to=2026-08-31`);

  await expect(page.getByText('Aug 1 – Aug 31, 2026', { exact: true })).toBeVisible();
  await expect(page.getByLabel('From', { exact: true })).toBeHidden();
});

test('keeps the custom period form inside the screen', async ({ page }) => {
  await page.goto(`/${STORE_ID}/overview`);

  await page.getByText('Custom', { exact: true }).click();

  const form = page.locator('form', { has: page.getByLabel('From', { exact: true }) });
  await expect(form).toBeVisible();
  const box = await form.boundingBox();
  const screenWidth = page.viewportSize()?.width ?? 0;
  expect(box?.x ?? -1).toBeGreaterThanOrEqual(0);
  expect((box?.x ?? 0) + (box?.width ?? screenWidth + 1)).toBeLessThanOrEqual(screenWidth);
});

test('stretches the sidebar down the whole screen on a desktop', async ({ page, isMobile }) => {
  test.skip(isMobile, 'The sidebar is a menu behind a button on narrow screens.');
  await page.goto(`/${STORE_ID}/overview`);

  const box = await page.getByRole('navigation', { name: 'Main navigation' }).boundingBox();

  expect(box?.height).toBe(page.viewportSize()?.height);
});

test('switches project and keeps the period', async ({ page, isMobile }) => {
  await page.goto(`/${STORE_ID}/overview?range=7d`);
  await openNavigation(page, isMobile);

  await page.locator('summary', { hasText: 'Switch project' }).click();
  await page.getByRole('link', { name: 'Demo Docs' }).click();

  await expect(page).toHaveURL(new RegExp(`/${DOCS_ID}/overview\\?range=7d$`));
  await expect(page.getByText('How Demo Docs was used in the period')).toBeVisible();
});

test('answers not found for a project outside the account', async ({ page }) => {
  await page.goto('/00000000-0000-4000-8000-000000000000/overview');

  await expect(page.getByRole('heading', { name: 'Nothing here' })).toBeVisible();
});

test('signs out to the sign-in page', async ({ page, isMobile }) => {
  await page.goto(`/${STORE_ID}/overview`);
  await openNavigation(page, isMobile);

  await page.getByRole('button', { name: 'Sign out' }).click();

  await expect(page).toHaveURL(/\/sign-in$/);
});

test('remembers the chosen theme across a reload', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'light' });
  await page.goto(`/${STORE_ID}/overview`);

  await page.getByRole('button', { name: 'Switch theme' }).click();
  await page.reload();

  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await expect(page.getByRole('button', { name: 'Switch to light theme' })).toBeVisible();
});

test('collapses the navigation behind a menu button on a phone', async ({ page, isMobile }) => {
  test.skip(!isMobile, 'The menu button exists only on narrow screens.');
  await page.goto(`/${STORE_ID}/overview`);
  const overviewLink = page.getByRole('link', { name: 'Overview' });

  await expect(overviewLink).toBeHidden();
  await page.getByRole('button', { name: 'Open menu' }).click();
  await expect(overviewLink).toBeVisible();
  await overviewLink.click();
  await expect(page.getByRole('button', { name: 'Open menu' })).toHaveAttribute(
    'aria-expanded',
    'false',
  );
});

test('sends the security headers', async ({ request }) => {
  const response = await request.get('/sign-in');

  expect(response.headers()['content-security-policy']).toContain("frame-ancestors 'none'");
  expect(response.headers()['x-content-type-options']).toBe('nosniff');
  expect(response.headers()['x-powered-by']).toBeUndefined();
});
