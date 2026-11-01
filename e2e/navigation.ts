import { expect, type Locator, type Page } from '@playwright/test';

const LAPTOP_WIDTH_PX = 1024;

export function hasThePhoneBar(page: Page): boolean {
  return (page.viewportSize()?.width ?? LAPTOP_WIDTH_PX) < LAPTOP_WIDTH_PX;
}

export function phoneBar(page: Page): Locator {
  return page.getByRole('navigation', { name: 'Main navigation' });
}

export function screensMenu(page: Page): Locator {
  return page
    .getByRole('dialog', { name: 'Screens' })
    .or(page.getByRole('navigation', { name: 'Main navigation' }));
}

export async function openScreens(page: Page): Promise<void> {
  await phoneBar(page)
    .getByRole('button', { name: /^Screens/ })
    .click();
  await expect(page.getByRole('dialog', { name: 'Screens' })).toBeVisible();
}

export async function openScreensOnAPhone(page: Page, isMobile: boolean): Promise<void> {
  if (isMobile) {
    await openScreens(page);
  }
}

export function currentNavigationLinks(page: Page): Locator {
  return screensMenu(page).locator('a[aria-current="page"]:not(details a)');
}

export async function backToTheTop(page: Page): Promise<void> {
  await page.evaluate(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  });
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

export function accountMenuButton(page: Page): Locator {
  return page.getByRole('banner').locator('summary', { hasText: 'Account and preferences' });
}

export async function openAccountMenu(page: Page): Promise<void> {
  await accountMenuButton(page).click();
  await expect(page.getByRole('link', { name: 'Theme and language' })).toBeVisible();
}

export function accountButton(page: Page): Locator {
  return hasThePhoneBar(page)
    ? phoneBar(page).getByRole('link', { name: 'Account' })
    : accountMenuButton(page);
}

export async function openAccountRow(page: Page, row: string | RegExp): Promise<void> {
  if (hasThePhoneBar(page)) {
    await accountButton(page).click();
    await page.getByRole('dialog', { name: 'Settings' }).getByRole('link', { name: row }).click();
    return;
  }
  await openAccountMenu(page);
  await page.getByRole('link', { name: row }).click();
}

export async function signOutButton(page: Page): Promise<Locator> {
  if (hasThePhoneBar(page)) {
    await accountButton(page).click();
    return page.getByRole('dialog', { name: 'Settings' }).getByRole('button', {
      name: 'Sign out',
      exact: true,
    });
  }
  await openAccountMenu(page);
  return page.getByRole('button', { name: 'Sign out', exact: true });
}

export async function openThemeAndLanguage(page: Page): Promise<Locator> {
  await openAccountRow(page, 'Theme and language');
  const part = page.getByRole('dialog').getByRole('region', { name: 'Theme and language' });
  await expect(part).toBeVisible();
  return part;
}

export async function openPeriodOnAPhone(page: Page): Promise<void> {
  const sheet = page.getByRole('dialog', { name: 'Period' });
  if (hasThePhoneBar(page) && (await sheet.count()) === 0) {
    await phoneBar(page)
      .getByRole('button', { name: /^Period/ })
      .click();
    await expect(sheet).toBeVisible();
  }
}

export function periods(page: Page): Locator {
  return page
    .getByRole('dialog', { name: 'Period' })
    .or(page.getByRole('banner'))
    .getByRole('navigation', { name: 'Period' });
}

export async function expectPeriodInForce(page: Page, preset: string): Promise<void> {
  if (hasThePhoneBar(page)) {
    await expect(phoneBar(page).getByRole('button', { name: `Period ${preset}` })).toBeVisible();
    return;
  }
  await expect(periods(page).getByRole('link', { name: preset })).toHaveAttribute(
    'aria-current',
    'page',
  );
}

export async function openFiltersOnAPhone(page: Page): Promise<void> {
  const sheet = page.getByRole('dialog', { name: 'Filters' });
  if (hasThePhoneBar(page) && (await sheet.count()) === 0) {
    await phoneBar(page)
      .getByRole('button', { name: /^Filters/ })
      .click();
    await expect(sheet).toBeVisible();
  }
}

export async function closeTheSheetOnAPhone(page: Page): Promise<void> {
  if (hasThePhoneBar(page)) {
    await page.keyboard.press('Escape');
    await expect(page.getByRole('dialog')).toHaveCount(0);
  }
}

export async function expectAppliedFilters(page: Page, chips: readonly string[]): Promise<void> {
  const row = page.getByRole('region', { name: 'Filters', exact: true });
  if (!hasThePhoneBar(page)) {
    await expect(row.getByRole('listitem')).toHaveText(chips);
    return;
  }
  await expect(
    phoneBar(page).getByRole('button', { name: `Filters, ${String(chips.length)}` }),
  ).toBeVisible();
  await openFiltersOnAPhone(page);
  await expect(row.getByRole('listitem')).toHaveText(chips);
  await closeTheSheetOnAPhone(page);
}

export function customPeriod(page: Page): Locator {
  return page.locator('summary', { hasText: 'Custom' });
}

export function shownDates(page: Page): Locator {
  return customPeriod(page).locator('[data-shown-dates]');
}
