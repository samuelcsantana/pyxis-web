import { expect, type Locator, type Page, type Request, type Response } from '@playwright/test';

export function currentNavigationLinks(page: Page): Locator {
  return page
    .getByRole('navigation', { name: 'Main navigation' })
    .locator('a[aria-current="page"]:not(details a)');
}

function readsAWholeScreen(request: Request): boolean {
  const headers = request.headers();
  return headers.rsc === '1' && headers['next-router-prefetch'] === undefined;
}

export async function holdScreenRequests(page: Page): Promise<() => void> {
  let release: () => void = () => undefined;
  const released = new Promise<void>((resolve) => {
    release = resolve;
  });
  await page.route('**/*', async (route) => {
    if (readsAWholeScreen(route.request())) {
      await released;
    }
    await route.continue();
  });
  return release;
}

export function wholeScreenRead(page: Page, path: string): Promise<Response> {
  return page.waitForResponse(
    (response) =>
      readsAWholeScreen(response.request()) && new URL(response.url()).pathname === path,
  );
}

export async function untilFullyReceived(page: Page, read: Promise<Response>): Promise<void> {
  const response = await read;
  await page.waitForFunction(
    (name) => performance.getEntriesByName(name, 'resource').length > 0,
    response.url(),
  );
}

const DOCUMENT_MARKER = 'pyxisE2eDocument';

export async function markTheDocument(page: Page) {
  await page.evaluate((name) => {
    Reflect.set(window, name, 'kept');
  }, DOCUMENT_MARKER);
}

export function documentMarker(page: Page): Promise<string> {
  return page.evaluate((name) => String(Reflect.get(window, name)), DOCUMENT_MARKER);
}

const BUSY_MARKER = 'pyxisE2eSawBusy';

export async function watchForBusyContent(page: Page): Promise<void> {
  await page.evaluate((name) => {
    Reflect.set(window, name, false);
    new MutationObserver(() => {
      if (document.querySelector('main[aria-busy="true"]') !== null) {
        Reflect.set(window, name, true);
      }
    }).observe(document.body, { subtree: true, childList: true, attributes: true });
  }, BUSY_MARKER);
}

export function sawBusyContent(page: Page): Promise<boolean> {
  return page.evaluate((name) => Reflect.get(window, name) === true, BUSY_MARKER);
}

export const ACCOUNT_MENU = 'Account menu';

export function accountMenu(page: Page, name: string = ACCOUNT_MENU) {
  return page.locator('summary', { hasText: name });
}

export async function openAccountMenu(page: Page, isMobile: boolean): Promise<void> {
  if (isMobile) {
    await page.getByRole('button', { name: 'Open menu' }).click();
  }
  await accountMenu(page).click();
  await expect(
    page.locator('details[open]').getByRole('link', { name: 'Help and support' }),
  ).toBeVisible();
}

export async function openTheLanguagesOfTheAccountMenu(page: Page): Promise<void> {
  await page.locator('details[open] button[aria-haspopup="dialog"]').click();
  await expect(page.getByRole('dialog').getByRole('searchbox')).toBeFocused();
}

export async function openSettings(page: Page, isMobile: boolean): Promise<void> {
  if (isMobile) {
    await page.getByRole('button', { name: 'Open menu' }).click();
  }
  await page
    .getByRole('navigation', { name: 'Main navigation' })
    .getByRole('link', { name: 'Settings', exact: true })
    .click();
  await expect(page.getByRole('dialog', { name: 'Settings' })).toBeVisible();
}
