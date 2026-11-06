import { expect, test } from '@playwright/test';
import { axeViolations, sidewaysOverflow } from './accessibility';

const DEMO_TOKEN = 'pyxis_sh_DemoLinkWithInventedNumbers00000';
const SHARED = `/share/${DEMO_TOKEN}`;
const CLOSED = `/share/pyxis_sh_${'A'.repeat(32)}`;
const PROTECTED = '/share/pyxis_sh_DemoLinkWithAPasswordToType00000';
const DEMO_PASSWORD = 'pyxis-demo';
const SCREENS = [
  { path: '', heading: 'Overview', text: 'Visits' },
  { path: '/acquisition', heading: 'Acquisition', text: 'Paid visits' },
  { path: '/devices', heading: 'Devices', text: 'Reach' },
  { path: '/features', heading: 'Features', text: 'Most used events' },
  { path: '/funnel', heading: 'Funnel', text: 'Overall conversion' },
] as const;

for (const colorScheme of ['light', 'dark'] as const) {
  test.describe(`the shared page, ${colorScheme} theme`, () => {
    test.use({ colorScheme });

    for (const shared of SCREENS) {
      test(`the shared ${shared.heading} has no WCAG 2.2 A or AA violation and never scrolls sideways`, async ({
        page,
      }) => {
        await page.goto(`${SHARED}${shared.path}?range=30d`);
        await expect(page.getByRole('heading', { level: 1, name: shared.heading })).toBeVisible();
        await expect(page.getByText(shared.text).first()).toBeVisible();
        expect(await axeViolations(page)).toEqual([]);
        expect(await sidewaysOverflow(page)).toBe(0);
      });
    }

    test('the password screen and its error have no WCAG 2.2 A or AA violation', async ({
      page,
    }) => {
      await page.goto(PROTECTED);
      const field = page.getByLabel('Password', { exact: true });
      await expect(field).toBeFocused();
      expect(await axeViolations(page)).toEqual([]);
      expect(await sidewaysOverflow(page)).toBe(0);

      await field.fill('not the one');
      await page.getByRole('button', { name: 'Open the report' }).click();
      await expect(page.getByRole('main').getByRole('alert')).toBeVisible();
      expect(await axeViolations(page)).toEqual([]);
    });

    test('the closed link has no WCAG 2.2 A or AA violation', async ({ page }) => {
      await page.goto(CLOSED);
      await expect(page.getByRole('heading', { name: 'This link does not open' })).toBeVisible();
      expect(await axeViolations(page)).toEqual([]);
    });
  });
}

test('opens the shared reports read-only, kept out of search engines', async ({ page }) => {
  const response = await page.goto(`${SHARED}?range=30d`);

  expect(response?.headers()['x-robots-tag']).toBe('noindex, nofollow');
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'noindex, nofollow');
  await expect(page.getByRole('link', { name: 'Pyxis' })).toHaveAttribute(
    'href',
    'https://pyxis-analytics.dev',
  );
  const screens = page.getByRole('navigation', { name: 'Shared reports' });
  await expect(screens.getByRole('link')).toHaveText([
    'Overview',
    'Acquisition',
    'Devices',
    'Features',
    'Funnel',
  ]);
  await expect(page.getByRole('button', { name: 'Account menu' })).toHaveCount(0);
  await expect(page.locator('a[href*="/visits"]')).toHaveCount(0);
});

test('keeps the period from one shared screen to the next', async ({ page }) => {
  await page.goto(`${SHARED}?range=7d`);
  await expect(page.getByRole('heading', { level: 1, name: 'Overview' })).toBeVisible();

  await page
    .getByRole('navigation', { name: 'Shared reports' })
    .getByRole('link', { name: 'Devices' })
    .click();

  await expect(page).toHaveURL(`${SHARED}/devices?range=7d`);
  await expect(page.getByRole('heading', { level: 1, name: 'Devices' })).toBeVisible();
});

test('says the same thing to a closed link and to an address that is not a link', async ({
  page,
}) => {
  await page.goto(CLOSED);
  await expect(page.getByRole('heading', { name: 'This link does not open' })).toBeVisible();

  const response = await page.goto('/share/not-a-link');
  expect(response?.status()).toBe(404);
  await expect(page.getByRole('heading', { name: 'This link does not open' })).toBeVisible();
});

test('asks for the password of a protected link and opens it for the rest of the visit', async ({
  page,
}) => {
  await page.goto(`${PROTECTED}?range=30d`);

  await expect(
    page.getByRole('heading', { level: 1, name: 'This report asks for a password' }),
  ).toBeVisible();
  await expect(page.getByText('My site')).toHaveCount(0);
  await expect(page.getByText(`In this demo, the password is ${DEMO_PASSWORD}.`)).toBeVisible();

  const field = page.getByLabel('Password', { exact: true });
  await field.fill('not the one');
  await page.getByRole('button', { name: 'Open the report' }).click();
  await expect(page.getByRole('main').getByRole('alert')).toHaveText(
    'Wrong password. Check it and try again.',
  );
  await expect(field).toHaveValue('not the one');

  await field.fill(DEMO_PASSWORD);
  await page.getByRole('button', { name: 'Open the report' }).click();
  await expect(page.getByRole('heading', { level: 1, name: 'Overview' })).toBeVisible();

  await page.getByRole('link', { name: 'Devices' }).click();
  await expect(page.getByRole('heading', { level: 1, name: 'Devices' })).toBeVisible();
  await page.reload();
  await expect(page.getByRole('heading', { level: 1, name: 'Devices' })).toBeVisible();
});
