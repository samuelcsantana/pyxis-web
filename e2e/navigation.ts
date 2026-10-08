import type { Page } from '@playwright/test';

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
