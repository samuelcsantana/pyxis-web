import { expect, type Page, test } from '@playwright/test';
import { axeViolations } from './accessibility';

const STORE_ID = '6f1d3c2a-8b4e-4f7a-9c1d-2e3f4a5b6c7d';

async function holdScreenRequests(page: Page): Promise<() => void> {
  let release: () => void = () => undefined;
  const released = new Promise<void>((resolve) => {
    release = resolve;
  });
  await page.route('**/*', async (route) => {
    const headers = route.request().headers();
    if (headers.rsc === '1' && headers['next-router-prefetch'] === undefined) {
      await released;
    }
    await route.continue();
  });
  return release;
}

const PREFETCH_REQUESTS_PER_SCREEN = 2;

async function waitForPrefetchOf(page: Page, screen: string) {
  await page.waitForFunction(
    ({ path, count }) =>
      performance
        .getEntriesByType('resource')
        .filter((entry) => entry.name.includes(`${path}?_rsc=`)).length >= count,
    { path: `/${STORE_ID}/${screen}`, count: PREFETCH_REQUESTS_PER_SCREEN },
  );
}

test('keeps the top bar with the destination title while a screen loads', async ({
  page,
  isMobile,
}) => {
  await page.goto(`/${STORE_ID}/overview`);
  await expect(page.getByRole('heading', { level: 1, name: 'Overview' })).toBeVisible();
  if (isMobile) {
    await page.getByRole('button', { name: 'Open menu' }).click();
  }
  await waitForPrefetchOf(page, 'devices');
  const release = await holdScreenRequests(page);

  await page
    .getByRole('navigation', { name: 'Main navigation' })
    .getByRole('link', { name: 'Devices', exact: true })
    .click();

  await expect(page.getByRole('heading', { level: 1, name: 'Devices' })).toBeVisible();
  await expect(page.getByRole('status')).toHaveText('Loading Devices…');
  await expect(page.getByRole('main')).toHaveAttribute('aria-busy', 'true');
  await expect(
    page
      .getByRole('navigation', { name: 'Main navigation', includeHidden: true })
      .getByRole('link', { name: 'Devices', exact: true, includeHidden: true }),
  ).toHaveAttribute('aria-current', 'page');
  expect(await axeViolations(page)).toEqual([]);

  release();

  await expect(page.getByText('What people use to reach Demo Store')).toBeVisible();
  await expect(page.getByRole('main')).not.toHaveAttribute('aria-busy');
});
