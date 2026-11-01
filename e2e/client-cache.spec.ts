import { expect, type Page, test } from '@playwright/test';
import {
  openTheLanguagesOfTheAccountMenu,
  sawBusyContent,
  watchForBusyContent,
} from './navigation';

const STORE_ID = '6f1d3c2a-8b4e-4f7a-9c1d-2e3f4a5b6c7d';
const JUST_PAST_THE_REFRESH_BOUND = '00:21';
const JUST_PAST_THE_CLIENT_CACHE = '05:01';

async function openMenuOnAPhone(page: Page, isMobile: boolean): Promise<void> {
  if (isMobile) {
    await page.getByRole('button', { name: 'Open menu' }).click();
  }
}

async function goTo(page: Page, isMobile: boolean, screen: string): Promise<void> {
  await openMenuOnAPhone(page, isMobile);
  await page
    .getByRole('navigation', { name: 'Main navigation' })
    .getByRole('link', { name: screen, exact: true })
    .click();
  await expect(page.getByRole('heading', { level: 1, name: screen })).toBeVisible();
  await expect(page.getByRole('main')).not.toHaveAttribute('aria-busy');
}

function readsOverview(page: Page) {
  return page.waitForRequest(
    (request) =>
      request.url().includes(`/${STORE_ID}/overview`) &&
      request.headers().rsc === '1' &&
      request.headers()['next-router-prefetch'] === undefined,
  );
}

async function openOverviewThenFunnel(page: Page, isMobile: boolean): Promise<void> {
  await page.clock.install();
  await page.goto(`/${STORE_ID}/overview`);
  await expect(page.getByRole('main')).not.toHaveAttribute('aria-busy');
  await goTo(page, isMobile, 'Funnel');
}

test('comes back to a visited screen without its skeleton', async ({ page, isMobile }) => {
  await openOverviewThenFunnel(page, isMobile);
  await watchForBusyContent(page);

  await goTo(page, isMobile, 'Overview');

  expect(await sawBusyContent(page)).toBe(false);
});

test('reads a screen that came back after 20 seconds again, still without its skeleton', async ({
  page,
  isMobile,
}) => {
  await openOverviewThenFunnel(page, isMobile);
  await page.clock.fastForward(JUST_PAST_THE_REFRESH_BOUND);
  await watchForBusyContent(page);
  const read = readsOverview(page);

  await goTo(page, isMobile, 'Overview');

  await read;
  await expect(page.getByRole('main')).not.toHaveAttribute('aria-busy');
  expect(await sawBusyContent(page)).toBe(false);
});

test('loads a screen visited more than five minutes ago as a new one', async ({
  page,
  isMobile,
}) => {
  await openOverviewThenFunnel(page, isMobile);
  await page.clock.fastForward(JUST_PAST_THE_CLIENT_CACHE);
  const read = readsOverview(page);

  await goTo(page, isMobile, 'Overview');

  await read;
});

test('shows a visited screen in the language chosen since', async ({ page, isMobile }) => {
  await openOverviewThenFunnel(page, isMobile);

  await openMenuOnAPhone(page, isMobile);
  await page.locator('summary', { hasText: 'Account and preferences' }).click();
  await openTheLanguagesOfTheAccountMenu(page);
  await page.getByRole('button', { name: 'Português (Brasil)' }).click();
  await expect(page.locator('html')).toHaveAttribute('lang', 'pt-BR');

  await page.locator('summary', { hasText: 'Conta e preferências' }).click();
  const overview = page
    .getByRole('navigation', { name: 'Navegação principal' })
    .getByRole('link', { name: 'Visão geral', exact: true });
  if (isMobile && !(await overview.isVisible())) {
    await page.getByRole('button', { name: 'Abrir menu' }).click();
  }
  await overview.click();

  await expect(page.getByRole('heading', { level: 1, name: 'Visão geral' })).toBeVisible();
  await expect(page.getByRole('group', { name: 'Visitas', exact: true })).toBeVisible();
});
