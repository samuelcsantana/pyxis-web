import { expect, type Locator, type Page, test } from '@playwright/test';
import { holdScreenRequests, sawBusyContent, watchForBusyContent } from './navigation';

const STORE_ID = '6f1d3c2a-8b4e-4f7a-9c1d-2e3f4a5b6c7d';
const PHONES_HAVE_NO_HOVER = 'A phone has no pointer resting on a link.';

function screenLink(page: Page, name: string): Locator {
  return page
    .getByRole('navigation', { name: 'Main navigation' })
    .getByRole('link', { name, exact: true });
}

function readsOf(url: string, screen: string, rsc: string | undefined): boolean {
  return url.includes(`/${STORE_ID}/${screen}`) && rsc === '1';
}

function prefetchesOf(page: Page, screen: string) {
  return page.waitForResponse((response) =>
    readsOf(response.url(), screen, response.request().headers().rsc),
  );
}

async function openOverview(page: Page): Promise<void> {
  await page.goto(`/${STORE_ID}/overview`);
  await expect(page.getByRole('main')).not.toHaveAttribute('aria-busy');
  await page.waitForLoadState('networkidle');
}

async function opensWithoutAskingTheServer(page: Page, link: Locator): Promise<void> {
  const release = await holdScreenRequests(page);
  await watchForBusyContent(page);

  await link.press('Enter');

  await expect(page.getByRole('heading', { level: 1, name: 'Devices' })).toBeVisible();
  await expect(page.getByRole('main')).not.toHaveAttribute('aria-busy');
  await expect(page.getByRole('region', { name: 'Device type', exact: true })).toBeVisible();
  expect(await sawBusyContent(page)).toBe(false);
  release();
}

test('opens a screen whose link the pointer rested on without its skeleton, the first time too', async ({
  page,
  isMobile,
}) => {
  test.skip(isMobile, PHONES_HAVE_NO_HOVER);
  await openOverview(page);
  const devices = screenLink(page, 'Devices');
  const prefetched = prefetchesOf(page, 'devices');

  await devices.hover();
  await prefetched;

  await opensWithoutAskingTheServer(page, devices);
});

test('fetches the screen of a link the keyboard focused', async ({ page, isMobile }) => {
  test.skip(isMobile, PHONES_HAVE_NO_HOVER);
  await openOverview(page);
  const devices = screenLink(page, 'Devices');
  const prefetched = prefetchesOf(page, 'devices');

  await devices.focus();
  await prefetched;

  await opensWithoutAskingTheServer(page, devices);
});

test('fetches a screen once, however often the pointer comes back to its link', async ({
  page,
  isMobile,
}) => {
  test.skip(isMobile, PHONES_HAVE_NO_HOVER);
  await openOverview(page);
  const devices = screenLink(page, 'Devices');
  const prefetched = prefetchesOf(page, 'devices');
  await devices.hover();
  await prefetched;
  await page.waitForLoadState('networkidle');
  const again: string[] = [];
  page.on('request', (request) => {
    if (readsOf(request.url(), 'devices', request.headers().rsc)) {
      again.push(request.url());
    }
  });

  await page.getByRole('heading', { level: 1, name: 'Overview' }).hover();
  await devices.hover();
  await page.getByRole('heading', { level: 1, name: 'Overview' }).hover();
  await devices.hover();
  await page.waitForLoadState('networkidle');

  expect(again).toEqual([]);
});
