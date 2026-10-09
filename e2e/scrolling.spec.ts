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
