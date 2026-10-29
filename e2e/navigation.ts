import { expect, type Locator, type Page } from '@playwright/test';

export function currentNavigationLinks(page: Page): Locator {
  return page
    .getByRole('navigation', { name: 'Main navigation' })
    .locator('a[aria-current="page"]:not(details a)');
}

export async function holdScreenRequests(page: Page): Promise<() => void> {
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

export async function openAccountMenu(page: Page, isMobile: boolean): Promise<void> {
  if (isMobile) {
    await page.getByRole('button', { name: 'Open menu' }).click();
  }
  const account = page.locator('summary', { hasText: 'Account and preferences' });
  await account.click();
  await expect(page.getByRole('group', { name: 'Theme' })).toBeVisible();
}
