import { expect, type Page, test } from '@playwright/test';
import { axeViolations } from './accessibility';
import { openAccountMenu, openSettings } from './navigation';

const STORE_ID = '6f1d3c2a-8b4e-4f7a-9c1d-2e3f4a5b6c7d';
const OVERVIEW = `/${STORE_ID}/overview`;
const SCROLLED_PX = 300;
const SHORT_WINDOW = { width: 1280, height: 420 } as const;

function settings(page: Page) {
  return page.getByRole('dialog', { name: 'Settings' });
}

async function markThePage(page: Page): Promise<void> {
  await expect(page.getByRole('main')).not.toHaveAttribute('aria-busy');
  await page.waitForLoadState('networkidle');
  await page.evaluate(() => {
    Reflect.set(window, '__shownMain', document.querySelector('main'));
  });
}

function sameMainAsMarked(page: Page): Promise<boolean> {
  return page.evaluate(() => Reflect.get(window, '__shownMain') === document.querySelector('main'));
}

test('opens the settings over the page without touching it, and gives the focus back on Escape', async ({
  page,
  isMobile,
}) => {
  await page.goto(OVERVIEW);
  await markThePage(page);
  if (!isMobile) {
    await page.evaluate((top) => {
      window.scrollTo(0, top);
    }, SCROLLED_PX);
    await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(SCROLLED_PX);
  }

  await openSettings(page, isMobile);

  await expect(page).toHaveURL(new RegExp(`${OVERVIEW}#settings/general$`));
  await expect(settings(page).getByText('owner@example.com')).toBeVisible();
  expect(await sameMainAsMarked(page)).toBe(true);
  expect(await axeViolations(page)).toEqual([]);

  await page.keyboard.press('Escape');

  await expect(settings(page)).toBeHidden();
  await expect(page).toHaveURL(new RegExp(`${OVERVIEW}$`));
  await expect(
    page
      .getByRole('navigation', { name: 'Main navigation' })
      .getByRole('link', { name: 'Settings', exact: true }),
  ).toBeFocused();
  expect(await sameMainAsMarked(page)).toBe(true);
  if (!isMobile) {
    expect(await page.evaluate(() => window.scrollY)).toBe(SCROLLED_PX);
  }
});

test('moves between sections in place, and Back closes it without reloading the page', async ({
  page,
  isMobile,
}) => {
  await page.goto(OVERVIEW);
  await markThePage(page);
  await openSettings(page, isMobile);
  const sections = settings(page).getByRole('navigation', { name: 'Settings sections' });

  if (isMobile) {
    await settings(page).getByRole('button', { name: 'All settings' }).click();
  }
  await sections.getByRole('link', { name: 'Keys' }).click();

  await expect(page).toHaveURL(/#settings\/keys$/);
  await expect(
    settings(page)
      .getByText(/pyxis_pk_/)
      .first(),
  ).toBeVisible();
  expect(await axeViolations(page)).toEqual([]);

  await page.goBack();
  await expect(settings(page)).toBeHidden();
  await page.goForward();
  await expect(settings(page)).toBeVisible();
  expect(await sameMainAsMarked(page)).toBe(true);
});

test('opens the section an address asks for, and the install guide from the navigation', async ({
  page,
  isMobile,
}) => {
  await page.goto(`${OVERVIEW}#settings/help`);
  await expect(settings(page).getByText('hello@pyxis-analytics.dev')).toBeVisible();
  expect(await axeViolations(page)).toEqual([]);
  await settings(page).getByRole('button', { name: 'Close settings' }).click();
  await expect(settings(page)).toBeHidden();

  if (isMobile) {
    await page.getByRole('button', { name: 'Open menu' }).click();
  }
  await page
    .getByRole('navigation', { name: 'Main navigation' })
    .getByRole('link', {
      name: /^Install/,
    })
    .click();

  await expect(page).toHaveURL(/#settings\/install$/);
  await expect(settings(page).getByText('1. Install Pyxis on your site')).toBeVisible();
  expect(await axeViolations(page)).toEqual([]);
});

test('keeps the settings open behind the languages, and in the language chosen', async ({
  page,
  isMobile,
}) => {
  await page.goto(OVERVIEW);
  await openSettings(page, isMobile);
  await settings(page)
    .getByRole('button', { name: /^English/ })
    .click();
  const languages = page.getByRole('dialog', { name: 'Language' });
  await expect(languages.getByRole('searchbox')).toBeFocused();
  expect(await axeViolations(page)).toEqual([]);

  await page.keyboard.press('Escape');
  await expect(languages).toBeHidden();
  await expect(settings(page)).toBeVisible();

  await settings(page)
    .getByRole('button', { name: /^English/ })
    .click();
  await languages.getByRole('searchbox').fill('portu');
  await page.keyboard.press('Enter');

  await expect(page.locator('html')).toHaveAttribute('lang', 'pt-BR');
  await expect(page.getByRole('dialog', { name: 'Configurações' })).toBeVisible();
  await expect(page).toHaveURL(/#settings\/general$/);
});

test('opens the account menu with the settings, the language, the help and the usage', async ({
  page,
  isMobile,
}) => {
  await page.goto(OVERVIEW);
  await openAccountMenu(page, isMobile);
  const menu = page.locator('details[open]');

  await expect(menu.getByRole('link', { name: 'Settings' })).toBeVisible();
  await expect(menu.getByRole('button', { name: 'Language' })).toBeVisible();
  await expect(menu.getByRole('link', { name: /^Plan and billing:/ })).toBeVisible();
  expect(await axeViolations(page)).toEqual([]);

  await menu.getByRole('link', { name: 'Help and support' }).click();
  await expect(page).toHaveURL(/#settings\/help$/);
  await expect(settings(page).getByText('hello@pyxis-analytics.dev')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.locator('summary', { hasText: 'Account menu' })).toBeFocused();
});

test.describe(`in a ${String(SHORT_WINDOW.width)}×${String(SHORT_WINDOW.height)} window`, () => {
  test.use({ viewport: SHORT_WINDOW });

  test('takes the whole height and scrolls only its content', async ({ page, isMobile }) => {
    test.skip(isMobile, 'Phones open the settings full screen already.');
    await page.goto(`${OVERVIEW}#settings/general`);
    const dialog = settings(page);
    await expect(dialog).toBeVisible();

    const box = await dialog.boundingBox();

    expect(box?.height).toBe(SHORT_WINDOW.height);
    await expect(dialog.getByRole('button', { name: 'Close settings' })).toBeInViewport();
    expect(await axeViolations(page)).toEqual([]);
  });
});
