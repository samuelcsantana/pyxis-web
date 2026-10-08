import { expect, type Page, test } from '@playwright/test';
import { axeViolations, focusedElementIsUncovered, sidewaysOverflow } from './accessibility';

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
  await expect(page).toHaveTitle('Overview · Demo Store · Pyxis');
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

const REJECTED_RANGES = [
  { from: '2026-10-05', to: '2026-09-20', reason: 'it ends before it starts' },
  { from: '2025-01-01', to: '2026-10-01', reason: 'it is longer than 400 days' },
] as const;

for (const { from, to, reason } of REJECTED_RANGES) {
  test(`says it did not use ${from} to ${to}, and keeps the dates in the form`, async ({
    page,
  }) => {
    await page.goto(`/${STORE_ID}/overview?from=${from}&to=${to}`);

    const notice = page.getByText(/^That range was not used/);
    await expect(notice).toHaveText(
      `That range was not used: ${reason}. Showing the last 30 days instead.`,
    );
    await expect(notice).toHaveAttribute('role', 'status');
    await expect(
      page.getByRole('navigation', { name: 'Period' }).getByRole('link', { name: '30 days' }),
    ).toHaveAttribute('aria-current', 'true');
    for (const [label, value] of [
      ['From', from],
      ['To', to],
    ] as const) {
      const field = page.getByLabel(label, { exact: true });
      await expect(field).toBeVisible();
      await expect(field).toHaveValue(value);
      await expect(field).toHaveAttribute('aria-invalid', 'true');
    }
    expect(await axeViolations(page)).toEqual([]);
    expect(await sidewaysOverflow(page)).toBe(0);
  });
}

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
  await expect(page).toHaveTitle(/^Overview · Demo Docs/);
});

test('closes the project switcher when the focus moves past it, leaving that focus in sight', async ({
  page,
  isMobile,
}) => {
  await page.goto(`/${STORE_ID}/overview`);
  await page.waitForLoadState('networkidle');
  await openNavigation(page, isMobile);
  const switcher = page.locator('details', { hasText: 'Switch project' });

  await switcher.locator('summary').click();
  await expect(switcher).toHaveAttribute('open');
  for (let press = 0; press < 3; press += 1) {
    await page.keyboard.press('Tab');
  }

  await expect(switcher).not.toHaveAttribute('open');
  await expect(page.getByRole('link', { name: 'Overview', exact: true })).toBeFocused();
  expect(await focusedElementIsUncovered(page)).toBe(true);
});

test('closes the project switcher on Escape and keeps the mobile menu open', async ({
  page,
  isMobile,
}) => {
  await page.goto(`/${STORE_ID}/overview`);
  await page.waitForLoadState('networkidle');
  await openNavigation(page, isMobile);
  const switcher = page.locator('details', { hasText: 'Switch project' });

  await switcher.locator('summary').click();
  await page.keyboard.press('Tab');
  await page.keyboard.press('Escape');

  await expect(switcher).not.toHaveAttribute('open');
  await expect(switcher.locator('summary')).toBeFocused();
  if (isMobile) {
    await expect(page.locator(MENU_BUTTON)).toHaveAttribute('aria-expanded', 'true');
  }
});

test('closes the project switcher on a click outside it', async ({ page, isMobile }) => {
  test.skip(isMobile, 'On a phone the menu covers the page under the switcher.');
  await page.goto(`/${STORE_ID}/overview`);
  await page.waitForLoadState('networkidle');
  const switcher = page.locator('details', { hasText: 'Switch project' });

  await switcher.locator('summary').click();
  await page.getByRole('heading', { level: 1, name: 'Overview' }).click();

  await expect(switcher).not.toHaveAttribute('open');
});

test('closes the custom period form on Escape and on a click outside it', async ({ page }) => {
  await page.goto(`/${STORE_ID}/overview`);
  await page.waitForLoadState('networkidle');
  const custom = page.locator('details', { hasText: 'Custom' });

  await custom.locator('summary').click();
  await page.getByLabel('From', { exact: true }).focus();
  await page.keyboard.press('Escape');

  await expect(custom).not.toHaveAttribute('open');
  await expect(custom.locator('summary')).toBeFocused();

  await custom.locator('summary').click();
  await page.getByRole('heading', { level: 1, name: 'Overview' }).click();

  await expect(custom).not.toHaveAttribute('open');
});

test('answers not found for a project outside the account', async ({ page }) => {
  await page.goto('/00000000-0000-4000-8000-000000000000/overview');

  await expect(page.getByRole('heading', { level: 1, name: 'Page not found' })).toBeVisible();
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

test('skips the navigation to the content with the first Tab', async ({ page }) => {
  await page.goto(`/${STORE_ID}/overview`);
  await expect(page.getByRole('main')).not.toHaveAttribute('aria-busy');

  await page.keyboard.press('Tab');
  const skipLink = page.getByRole('link', { name: 'Skip to content' });
  await expect(skipLink).toBeFocused();
  await expect(skipLink).toBeInViewport();

  await page.keyboard.press('Enter');
  await expect(page.getByRole('main')).toBeFocused();
});

const MENU_BUTTON = 'button[aria-controls="main-navigation"]';

test('closes the menu with Escape and gives the focus back to its button', async ({
  page,
  isMobile,
}) => {
  test.skip(!isMobile, 'The menu button exists only on narrow screens.');
  await page.goto(`/${STORE_ID}/overview`);

  await page.getByRole('button', { name: 'Open menu' }).click();
  await page.keyboard.press('Escape');

  const toggle = page.locator(MENU_BUTTON);
  await expect(toggle).toHaveAttribute('aria-expanded', 'false');
  await expect(toggle).toBeFocused();
});

test('closes the menu when Back changes the address', async ({ page, isMobile }) => {
  test.skip(!isMobile, 'The menu button exists only on narrow screens.');
  await page.goto(`/${STORE_ID}/overview`);
  await page
    .getByRole('navigation', { name: 'Period' })
    .getByRole('link', { name: '7 days' })
    .click();
  await expect(page).toHaveURL(/range=7d$/);

  await page.getByRole('button', { name: 'Open menu' }).click();
  await page.goBack();

  await expect(page).toHaveURL(new RegExp(`/${STORE_ID}/overview$`));
  await expect(page.locator(MENU_BUTTON)).toHaveAttribute('aria-expanded', 'false');
});

test('keeps the menu bar on screen while the page scrolls', async ({ page, isMobile }) => {
  test.skip(!isMobile, 'The menu bar exists only on narrow screens.');
  await page.goto(`/${STORE_ID}/visits`);

  await page.evaluate(() => {
    window.scrollTo(0, document.documentElement.scrollHeight);
  });

  await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(0);
  const bar = await page.getByRole('navigation', { name: 'Main navigation' }).boundingBox();
  expect(bar?.y).toBe(0);
  await expect(page.getByRole('button', { name: 'Open menu' })).toBeInViewport();
});

test.describe('on a short phone', () => {
  test.use({ viewport: { width: 390, height: 640 } });

  test('keeps sign-out reachable inside the open menu', async ({ page, isMobile }) => {
    test.skip(!isMobile, 'The menu button exists only on narrow screens.');
    await page.goto(`/${STORE_ID}/overview`);

    await page.getByRole('button', { name: 'Open menu' }).click();
    const menu = await page.getByRole('navigation', { name: 'Main navigation' }).boundingBox();
    await page.getByRole('button', { name: 'Sign out' }).scrollIntoViewIfNeeded();

    expect(menu?.height).toBeLessThanOrEqual(640);
    await expect(page.getByRole('button', { name: 'Sign out' })).toBeInViewport();
    await expect(page.getByRole('button', { name: 'Close menu' })).toBeInViewport();
  });
});

test('sends the security headers', async ({ request }) => {
  const response = await request.get('/sign-in');

  expect(response.headers()['content-security-policy']).toContain("frame-ancestors 'none'");
  expect(response.headers()['x-content-type-options']).toBe('nosniff');
  expect(response.headers()['x-powered-by']).toBeUndefined();
});
