import { expect, test } from '@playwright/test';
import { axeViolations, focusedElementIsUncovered, sidewaysOverflow } from './accessibility';
import {
  accountButton,
  accountMenuButton,
  customPeriod,
  openScreens,
  openScreensOnAPhone,
  expectPeriodInForce,
  openPeriodOnAPhone,
  openThemeAndLanguage,
  periods,
  phoneBar,
  screensMenu,
  shownDates,
  signOutButton,
} from './navigation';
import { pickCustomRange } from './range-calendar';

const STORE_ID = '6f1d3c2a-8b4e-4f7a-9c1d-2e3f4a5b6c7d';
const DOCS_ID = '0c9b8a7d-6e5f-4a3b-8c2d-1e0f9a8b7c6d';
const TOUCH_TARGET_PX = 44;

for (const colorScheme of ['light', 'dark'] as const) {
  test.describe(`overview, ${colorScheme} theme`, () => {
    test.use({ colorScheme });

    test('has no WCAG 2.2 A or AA violation and never scrolls sideways', async ({ page }) => {
      await page.goto(`/${STORE_ID}/overview`);
      await expect(page.getByRole('heading', { level: 1, name: 'Overview' })).toBeVisible();

      expect(await axeViolations(page)).toEqual([]);
      expect(await sidewaysOverflow(page)).toBe(0);
    });

    test('has no WCAG 2.2 A or AA violation while a custom period is being picked', async ({
      page,
    }) => {
      await page.goto(`/${STORE_ID}/overview`);
      await openPeriodOnAPhone(page);
      await customPeriod(page).click();
      await page.getByRole('grid').locator('button[tabindex="0"]').click();
      await expect(page.getByText(/now choose the last day/)).toBeVisible();

      expect(await axeViolations(page)).toEqual([]);
      expect(await sidewaysOverflow(page)).toBe(0);
    });
  });
}

test('opens the first project from the root, with the demo banner', async ({ page }) => {
  await page.goto('/');

  await expect(page).toHaveURL(new RegExp(`/${STORE_ID}/overview$`));
  await expect(page.getByRole('note')).toContainText('Demo data');
  await expect(page).toHaveTitle('Overview · My site · Pyxis');
});

test('lists the screens in the order of the questions, then the project', async ({
  page,
  isMobile,
}) => {
  await page.goto(`/${STORE_ID}/overview`);
  await openScreensOnAPhone(page, isMobile);
  const navigation = screensMenu(page);

  await expect(navigation.getByText('Analytics', { exact: true })).toHaveCount(0);
  await expect(navigation.getByRole('list').first().getByRole('link')).toHaveText([
    'Overview',
    /^Acquisition/,
    /^Devices/,
    /^Features/,
    /^Funnel/,
    /^Visits/,
    'Timeline',
    /^Requests/,
  ]);
  await expect(navigation.getByRole('list').nth(1).getByRole('link')).toHaveText([
    'Install',
    'Settings',
  ]);
});

test('takes the logo to the overview of the project on screen, on the same period', async ({
  page,
  isMobile,
}) => {
  await page.goto(`/${DOCS_ID}/devices?range=7d`);

  const logo = isMobile
    ? page.getByRole('banner').getByRole('link', { name: 'Overview', exact: true })
    : page
        .getByRole('navigation', { name: 'Main navigation' })
        .getByRole('link', { name: 'Pyxis' });
  await logo.click();

  await expect(page).toHaveURL(new RegExp(`/${DOCS_ID}/overview\\?range=7d$`));
  await expect(page).toHaveTitle('Overview · Demo Docs · Pyxis');
});

test('starts a phone with the path, its logo and the project on 44px targets, after a switch too', async ({
  page,
  isMobile,
}) => {
  test.skip(!isMobile, 'This checks the top of a phone.');
  await page.goto(`/${STORE_ID}/overview`);
  const bar = page.getByRole('banner');
  const switcher = bar.locator('summary', { hasText: 'Switch project' });

  await expect(switcher).toContainText('My site');
  await switcher.click();
  await page.getByRole('link', { name: 'Demo Docs' }).click();

  await expect(page).toHaveTitle('Overview · Demo Docs · Pyxis');
  await expect(switcher).toContainText('Demo Docs');
  for (const target of [bar.getByRole('link', { name: 'Overview', exact: true }), switcher]) {
    const box = await target.boundingBox();
    expect(box?.height).toBeGreaterThanOrEqual(TOUCH_TARGET_PX);
    expect(box?.width).toBeGreaterThanOrEqual(TOUCH_TARGET_PX);
  }
});

test("shows the owner the month's usage of the project's account, and where it counts down to", async ({
  page,
  isMobile,
}) => {
  const today = new Date();
  const resetsOn = new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth() + 1, 1)));
  test.skip(
    isMobile,
    'The ring is on the avatar of a laptop; a phone reads it in Account and billing.',
  );
  await page.goto(`/${STORE_ID}/overview`);
  const account = accountMenuButton(page);

  await expect(account).toContainText('41,230 of 100,000 events this month');
  await expect(account.locator('[data-usage-ring]')).toBeVisible();
  await account.click();
  const usage = page.getByRole('link', { name: /41,230 of 100,000 events this month/ });
  await expect(usage).toBeVisible();
  await expect(usage).toContainText(`Count resets on ${resetsOn}`);
  await expect(usage).toHaveAttribute('href', '/account');
  expect(await axeViolations(page)).toEqual([]);
});

test('writes the chosen period into the URL', async ({ page }) => {
  await page.goto(`/${STORE_ID}/overview`);
  await openPeriodOnAPhone(page);

  await periods(page).getByRole('link', { name: '7 days' }).click();

  await expect(page).toHaveURL(/range=7d$/);
  await expectPeriodInForce(page, '7 days');
});

test('applies a custom period picked on the calendar through a plain form', async ({ page }) => {
  await page.goto(`/${STORE_ID}/overview`);
  await openPeriodOnAPhone(page);

  await customPeriod(page).click();
  await pickCustomRange(page, 'August 2026', 'Saturday, August 1, 2026', 'Monday, August 31, 2026');

  await expect(page).toHaveURL(/from=2026-08-01&to=2026-08-31$/);
  await expect(shownDates(page)).toHaveText(/^Aug 1\s–\s31$/);
  await expect(page.getByText('Page views and named events, Aug 1 – Aug 31, 2026')).toBeVisible();
});

test('picks a custom period with the keyboard alone', async ({ page, isMobile }) => {
  await page.goto(`/${STORE_ID}/overview`);
  await page.waitForLoadState('networkidle');
  const custom = page.locator('summary', { hasText: 'Custom' });
  if (isMobile) {
    await phoneBar(page)
      .getByRole('button', { name: /^Period/ })
      .focus();
    await page.keyboard.press('Enter');
  }

  await custom.focus();
  await page.keyboard.press('Enter');
  await expect(page.getByRole('grid')).toBeVisible();
  await page.getByRole('grid').locator('button[tabindex="0"]').focus();
  await page.keyboard.press('ArrowLeft');
  await page.keyboard.press('ArrowLeft');
  await page.keyboard.press('Enter');
  await expect(page.getByText(/now choose the last day/)).toBeVisible();
  await page.keyboard.press('ArrowRight');
  await page.keyboard.press('Enter');
  await expect(page.getByText(/· 2 days$/)).toBeVisible();
  await page.getByRole('button', { name: 'Apply' }).focus();
  await page.keyboard.press('Enter');

  await expect(page).toHaveURL(/from=\d{4}-\d{2}-\d{2}&to=\d{4}-\d{2}-\d{2}$/);
  const url = new URL(page.url());
  const from = Date.parse(url.searchParams.get('from') ?? '');
  const to = Date.parse(url.searchParams.get('to') ?? '');
  expect((to - from) / 86_400_000).toBe(1);
});

test('keeps the custom period calendar closed until asked for', async ({ page }) => {
  await page.goto(`/${STORE_ID}/overview?from=2026-08-01&to=2026-08-31`);

  await expect(shownDates(page)).toHaveText(/^Aug 1\s–\s31$/);
  await expect(page.getByRole('grid')).toBeHidden();
});

const REJECTED_RANGES = [
  { from: '2026-10-05', to: '2026-09-20', reason: 'it ends before it starts' },
  { from: '2025-01-01', to: '2026-10-01', reason: 'it is longer than 400 days' },
] as const;

for (const { from, to, reason } of REJECTED_RANGES) {
  test(`says it did not use ${from} to ${to}, and opens the calendar on the period in force`, async ({
    page,
  }) => {
    await page.goto(`/${STORE_ID}/overview?from=${from}&to=${to}`);

    const notice = page.getByText(/^That range was not used/);
    await expect(notice).toHaveText(
      `That range was not used: ${reason}. Showing the last 30 days instead.`,
    );
    await expect(notice).toHaveAttribute('role', 'status');
    await expectPeriodInForce(page, '30 days');
    await openPeriodOnAPhone(page);
    await expect(page.getByRole('grid')).toBeVisible();
    await expect(page.getByText(/· 30 days$/)).toHaveAttribute(
      'aria-describedby',
      'period-range-notice',
    );
    expect(await axeViolations(page)).toEqual([]);
    expect(await sidewaysOverflow(page)).toBe(0);
  });
}

test('keeps the custom period form inside the screen', async ({ page }) => {
  await page.goto(`/${STORE_ID}/overview`);
  await openPeriodOnAPhone(page);

  await customPeriod(page).click();

  const form = page.locator('form', { has: page.getByRole('grid') });
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

test('switches project from a 44px target in the top bar and keeps the period', async ({
  page,
}) => {
  await page.goto(`/${STORE_ID}/overview?range=7d`);
  const summary = page.getByRole('banner').locator('summary', { hasText: 'Switch project' });

  expect((await summary.boundingBox())?.height).toBeGreaterThanOrEqual(TOUCH_TARGET_PX);
  await summary.click();
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
  const switcher = page.getByRole('banner').locator('details', { hasText: 'Switch project' });

  await switcher.locator('summary').click();
  await expect(switcher).toHaveAttribute('open');
  const itemsInside = await switcher.getByRole('link').count();
  for (let press = 0; press <= itemsInside; press += 1) {
    await page.keyboard.press('Tab');
  }

  await expect(switcher).not.toHaveAttribute('open');
  if (!isMobile) {
    await expect(periods(page).getByRole('link', { name: 'Today' })).toBeFocused();
  }
  expect(await focusedElementIsUncovered(page)).toBe(true);
});

test('closes the project switcher on Escape, with the focus back on it', async ({ page }) => {
  await page.goto(`/${STORE_ID}/overview`);
  await page.waitForLoadState('networkidle');
  const switcher = page.getByRole('banner').locator('details', { hasText: 'Switch project' });

  await switcher.locator('summary').click();
  await page.keyboard.press('Tab');
  await page.keyboard.press('Escape');

  await expect(switcher).not.toHaveAttribute('open');
  await expect(switcher.locator('summary')).toBeFocused();
});

test('closes the project switcher on a click outside it', async ({ page }) => {
  await page.goto(`/${STORE_ID}/overview`);
  await page.waitForLoadState('networkidle');
  const switcher = page.getByRole('banner').locator('details', { hasText: 'Switch project' });

  await switcher.locator('summary').click();
  await page.getByRole('heading', { level: 1, name: 'Overview' }).click();

  await expect(switcher).not.toHaveAttribute('open');
});

test('closes the custom period form on Escape and on a click outside it', async ({
  page,
  isMobile,
}) => {
  await page.goto(`/${STORE_ID}/overview`);
  await page.waitForLoadState('networkidle');
  const custom = page.locator('details', { hasText: 'Custom' });
  await openPeriodOnAPhone(page);

  await custom.locator('summary').click();
  await page.getByRole('grid').locator('button[tabindex="0"]').focus();
  await page.keyboard.press('Escape');

  await expect(custom).not.toHaveAttribute('open');
  await expect(custom.locator('summary')).toBeFocused();

  await custom.locator('summary').click();
  if (isMobile) {
    await page.mouse.click(20, 20);
  } else {
    await page.getByRole('heading', { level: 1, name: 'Overview' }).click();
  }

  await expect(custom).not.toHaveAttribute('open');
});

test('answers not found for a project outside the account', async ({ page }) => {
  await page.goto('/00000000-0000-4000-8000-000000000000/overview');

  await expect(page.getByRole('heading', { level: 1, name: 'Page not found' })).toBeVisible();
});

test('signs out to the sign-in page', async ({ page }) => {
  await page.goto(`/${STORE_ID}/overview`);
  await (await signOutButton(page)).click();

  await expect(page).toHaveURL(/\/sign-in$/);
});

test('remembers the chosen theme across a reload, and goes back to the system one', async ({
  page,
}) => {
  await page.emulateMedia({ colorScheme: 'light' });
  await page.goto(`/${STORE_ID}/overview`);

  const part = await openThemeAndLanguage(page);
  await part.getByRole('button', { name: 'Dark' }).click();
  await page.reload();

  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await expect(page).toHaveURL(/\/account\/preferences$/);
  await expect(page.getByRole('button', { name: 'Dark' })).toHaveAttribute('aria-pressed', 'true');

  await page.getByRole('button', { name: 'System' }).click();
  await page.reload();

  await expect(page.locator('html')).not.toHaveAttribute('data-theme');
});

test('keeps the screens in a sheet of the bar at the bottom of a phone', async ({
  page,
  isMobile,
}) => {
  test.skip(!isMobile, 'The bar at the bottom exists only on narrow screens.');
  await page.goto(`/${STORE_ID}/overview`);
  const funnel = page.getByRole('link', { name: 'Funnel', exact: true });

  await expect(funnel).toBeHidden();
  await openScreens(page);
  await expect(funnel).toBeVisible();
  expect(await axeViolations(page)).toEqual([]);
  await funnel.click();

  await expect(page).toHaveURL(new RegExp(`/${STORE_ID}/funnel`));
  await expect(page.getByRole('dialog')).toHaveCount(0);
  await expect(phoneBar(page).getByRole('button', { name: 'Screens' })).toHaveAttribute(
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

test('closes a sheet with Escape or a tap above it, giving the focus back to its button', async ({
  page,
  isMobile,
}) => {
  test.skip(!isMobile, 'The bar at the bottom exists only on narrow screens.');
  await page.goto(`/${STORE_ID}/overview`);
  const screens = phoneBar(page).getByRole('button', { name: 'Screens' });

  await screens.focus();
  await page.keyboard.press('Enter');
  await expect(page.getByRole('dialog', { name: 'Screens' })).toBeVisible();
  await expect(
    page.getByRole('dialog', { name: 'Screens' }).getByRole('link').first(),
  ).toBeFocused();
  await page.keyboard.press('Escape');

  await expect(page.getByRole('dialog')).toHaveCount(0);
  await expect(screens).toHaveAttribute('aria-expanded', 'false');
  await expect(screens).toBeFocused();

  await openScreens(page);
  await page.mouse.click(20, 20);
  await expect(page.getByRole('dialog')).toHaveCount(0);
});

test('changes the period in two taps on a phone, and closes a sheet when Back changes the address', async ({
  page,
  isMobile,
}) => {
  test.skip(!isMobile, 'The bar at the bottom exists only on narrow screens.');
  await page.goto(`/${STORE_ID}/overview`);
  await page.evaluate(() => {
    window.scrollTo(0, document.documentElement.scrollHeight);
  });

  await phoneBar(page).getByRole('button', { name: 'Period' }).click();
  await page.getByRole('dialog', { name: 'Period' }).getByRole('link', { name: '7 days' }).click();
  await expect(page).toHaveURL(/range=7d$/);
  await expect(page.getByRole('dialog')).toHaveCount(0);

  await openScreens(page);
  await page.goBack();

  await expect(page).toHaveURL(new RegExp(`/${STORE_ID}/overview$`));
  await expect(page.getByRole('dialog')).toHaveCount(0);
});

test('keeps the path on top and the bar at the bottom while the page scrolls', async ({
  page,
  isMobile,
}) => {
  test.skip(!isMobile, 'The bar at the bottom exists only on narrow screens.');
  await page.goto(`/${STORE_ID}/visits`);

  await page.evaluate(() => {
    window.scrollTo(0, document.documentElement.scrollHeight);
  });

  await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(0);
  const path = await page.getByRole('banner').boundingBox();
  const bar = await phoneBar(page).boundingBox();
  expect(path?.y).toBe(0);
  expect((bar?.y ?? 0) + (bar?.height ?? 0)).toBe(page.viewportSize()?.height);
  for (const name of ['Screens', 'Period', 'Filters']) {
    const box = await phoneBar(page).getByRole('button', { name }).boundingBox();
    expect(box?.height).toBeGreaterThanOrEqual(TOUCH_TARGET_PX);
  }
});

test.describe('on a short phone', () => {
  test.use({ viewport: { width: 390, height: 640 } });

  test('opens Account as the list of the settings window, sign-out at its foot', async ({
    page,
    isMobile,
  }) => {
    test.skip(!isMobile, 'This checks the bar of a phone.');
    await page.goto(`/${STORE_ID}/overview`);
    const account = await accountButton(page).boundingBox();

    await accountButton(page).click();
    const window = page.getByRole('dialog', { name: 'Settings' });

    expect(account?.height).toBeGreaterThanOrEqual(TOUCH_TARGET_PX);
    for (const choice of [
      window.getByRole('link', { name: 'Account and billing' }),
      window.getByRole('link', { name: 'Theme and language' }),
      window.getByRole('link', { name: 'Help and support' }),
    ]) {
      await expect(choice).toBeVisible();
    }
    await window.getByRole('button', { name: 'Sign out', exact: true }).scrollIntoViewIfNeeded();
    await expect(window.getByRole('button', { name: 'Sign out', exact: true })).toBeInViewport({
      ratio: 1,
    });
    expect(await sidewaysOverflow(page)).toBe(0);
  });
});

test('sends the security headers', async ({ request }) => {
  const response = await request.get('/sign-in');

  expect(response.headers()['content-security-policy']).toContain("frame-ancestors 'none'");
  expect(response.headers()['x-content-type-options']).toBe('nosniff');
  expect(response.headers()['x-powered-by']).toBeUndefined();
});

for (const [locale, width] of [
  ['pt-BR', 1024],
  ['pt-BR', 1280],
  ['en', 1024],
] as const) {
  test(`keeps the header still while the period changes (${locale}, ${String(width)} px)`, async ({
    page,
    context,
    baseURL,
    isMobile,
  }) => {
    test.skip(isMobile, 'The widths under test are desktop widths.');
    await context.addCookies([{ name: 'pyxis_locale', value: locale, url: baseURL ?? '' }]);
    await page.setViewportSize({ width, height: 800 });
    const header = page.locator('header').first();
    const presets = header.getByRole('navigation');

    const layouts: string[] = [];
    for (const range of ['today', '7d', '30d']) {
      await page.goto(`/${STORE_ID}/overview?range=${range}`);
      await page.waitForLoadState('networkidle');
      const frame = await header.boundingBox();
      const group = await presets.boundingBox();
      layouts.push(
        JSON.stringify({ header: frame?.height, x: group?.x, y: group?.y, width: group?.width }),
      );
    }

    expect(new Set(layouts).size, layouts.join('\n')).toBe(1);
  });
}
