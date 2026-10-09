import { expect, type Page, test } from '@playwright/test';

const STORE_ID = '6f1d3c2a-8b4e-4f7a-9c1d-2e3f4a5b6c7d';
const PHONES_KEEP_ONLY_THEIR_MENU_BAR = 'On a phone the header scrolls away under the menu bar.';

test.use({
  viewport: { width: 1280, height: 800 },
  launchOptions: { ignoreDefaultArgs: ['--hide-scrollbars'] },
});

async function headerFrame(page: Page) {
  const header = page.getByRole('banner');
  await expect(header).toBeVisible();
  return header.evaluate((element) => {
    const box = element.getBoundingClientRect();
    return { left: box.left, right: box.right, width: box.width };
  });
}

async function openScreen(page: Page, screen: string): Promise<void> {
  await page.goto(`/${STORE_ID}/${screen}`);
  await expect(page.getByRole('main')).not.toHaveAttribute('aria-busy');
}

function pageScroll(page: Page): Promise<number> {
  return page.evaluate(() => window.scrollY);
}

test('keeps the header in place on a desktop whether the screen is long or short', async ({
  page,
  isMobile,
}) => {
  test.skip(isMobile, PHONES_KEEP_ONLY_THEIR_MENU_BAR);

  await openScreen(page, 'overview');
  const long = await headerFrame(page);
  await openScreen(page, 'timeline');
  const short = await headerFrame(page);

  expect(short).toEqual(long);
});

test('keeps the header and the sidebar in view on a desktop while the page scrolls', async ({
  page,
  isMobile,
}) => {
  test.skip(isMobile, PHONES_KEEP_ONLY_THEIR_MENU_BAR);
  await openScreen(page, 'overview');
  const before = await headerFrame(page);

  await page.getByRole('main').hover();
  await page.mouse.wheel(0, 1200);
  await expect.poll(() => pageScroll(page)).toBeGreaterThan(0);

  await expect
    .poll(() => page.getByRole('banner').evaluate((header) => header.getBoundingClientRect().top))
    .toBe(0);
  expect(await headerFrame(page)).toEqual(before);
  await expect(page.getByRole('navigation', { name: 'Main navigation' })).toBeInViewport();
});

test('scrolls with the keyboard as soon as the page opens', async ({ page, isMobile }) => {
  test.skip(isMobile, PHONES_KEEP_ONLY_THEIR_MENU_BAR);
  await openScreen(page, 'overview');

  await page.keyboard.press('PageDown');

  await expect.poll(() => pageScroll(page)).toBeGreaterThan(0);
});

test('opens the next screen at the top of the page', async ({ page, isMobile }) => {
  test.skip(isMobile, PHONES_KEEP_ONLY_THEIR_MENU_BAR);
  await openScreen(page, 'overview');
  await page.evaluate(() => {
    window.scrollTo({ top: 900, behavior: 'instant' });
  });
  expect(await pageScroll(page)).toBeGreaterThan(0);

  await page.getByRole('link', { name: 'Acquisition', exact: true }).click();

  await expect(page.getByRole('heading', { level: 1, name: 'Acquisition' })).toBeVisible();
  await expect(page.getByRole('main')).not.toHaveAttribute('aria-busy');
  await expect.poll(() => pageScroll(page)).toBe(0);
});

test('goes back to the same place after visiting another screen', async ({ page, isMobile }) => {
  test.skip(isMobile, PHONES_KEEP_ONLY_THEIR_MENU_BAR);
  await openScreen(page, 'overview');
  await page.evaluate(() => {
    window.scrollTo({ top: 900, behavior: 'instant' });
  });
  const place = await pageScroll(page);
  expect(place).toBeGreaterThan(0);

  await page.getByRole('link', { name: 'Features', exact: true }).click();
  await expect(page.getByRole('heading', { level: 1, name: 'Features' })).toBeVisible();
  await page.goBack();

  await expect(page.getByRole('heading', { level: 1, name: 'Overview' })).toBeVisible();
  await expect.poll(() => pageScroll(page)).toBe(place);
});

test('brings a control that takes the focus out from under the header', async ({
  page,
  isMobile,
}) => {
  test.skip(isMobile, PHONES_KEEP_ONLY_THEIR_MENU_BAR);
  await openScreen(page, 'overview');
  const control = page.getByRole('main').getByRole('link').first();
  const headerHeight = await page
    .getByRole('banner')
    .evaluate((header) => header.getBoundingClientRect().height);

  await control.evaluate((element, underTheHeader) => {
    const top = element.getBoundingClientRect().top + window.scrollY;
    window.scrollTo(0, top - underTheHeader);
  }, headerHeight / 2);
  await control.focus();

  const header = await page.getByRole('banner').boundingBox();
  const focused = await control.boundingBox();
  expect(focused?.y).toBeGreaterThanOrEqual((header?.y ?? 0) + (header?.height ?? 0));
});
