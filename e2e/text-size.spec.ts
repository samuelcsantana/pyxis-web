import { expect, type Page, test } from '@playwright/test';
import { sidewaysOverflow } from './accessibility';

const STORE_ID = '6f1d3c2a-8b4e-4f7a-9c1d-2e3f4a5b6c7d';
const DEFAULT_TEXT_PX = 16;
const READER_TEXT_PX = 32;
const EXPECTED_GROWTH = READER_TEXT_PX / DEFAULT_TEXT_PX;

const ROUTES = [
  { heading: 'Overview', path: `/${STORE_ID}/overview` },
  { heading: 'Funnel', path: `/${STORE_ID}/funnel` },
  { heading: 'Features', path: `/${STORE_ID}/features` },
  { heading: 'Requests', path: `/${STORE_ID}/requests` },
  { heading: 'Timeline', path: `/${STORE_ID}/timeline?user=u_7f3a` },
  { heading: 'Visits', path: `/${STORE_ID}/visits` },
  { heading: 'Devices', path: `/${STORE_ID}/devices` },
  { heading: 'Acquisition', path: `/${STORE_ID}/acquisition` },
  { heading: 'Sign in to Pyxis', path: '/sign-in' },
] as const;

const WIDTHS = [
  { name: '1280×800', viewport: { width: 1280, height: 800 }, onPhone: false },
  { name: '390×844', viewport: { width: 390, height: 844 }, onPhone: true },
] as const;

interface TextGrowth {
  readonly text: string;
  readonly growth: number;
}

function growthAtRootSize(page: Page, rootPx: number): Promise<TextGrowth[]> {
  return page.evaluate((root) => {
    const texts = [...document.body.querySelectorAll('*')].filter((element) => {
      const hasText = [...element.childNodes].some(
        (node) => node.nodeType === Node.TEXT_NODE && (node.textContent ?? '').trim() !== '',
      );
      return hasText && element.getClientRects().length > 0;
    });
    const sizeOf = (element: Element) => parseFloat(getComputedStyle(element).fontSize);
    const measured = texts.map((element) => ({ element, defaultSize: sizeOf(element) }));
    const style = document.createElement('style');
    style.textContent = `html { font-size: ${String(root)}px; }`;
    document.head.append(style);
    return measured.map(({ element, defaultSize }) => ({
      text: element.textContent.trim().slice(0, 40),
      growth: sizeOf(element) / defaultSize,
    }));
  }, rootPx);
}

for (const width of WIDTHS) {
  test.describe(`at ${width.name}, with the reader's text size at ${String(READER_TEXT_PX)}px`, () => {
    test.use({ viewport: width.viewport });

    for (const route of ROUTES) {
      test(`${route.heading} grows every text and never scrolls sideways`, async ({
        page,
        isMobile,
      }) => {
        test.skip(isMobile !== width.onPhone, 'Each width runs once, in its own project.');
        await page.goto(route.path);
        await expect(page.getByRole('heading', { level: 1, name: route.heading })).toBeVisible();
        await page.waitForLoadState('networkidle');

        const growth = await growthAtRootSize(page, READER_TEXT_PX);

        expect(growth.filter((text) => text.growth !== EXPECTED_GROWTH)).toEqual([]);
        await expect.poll(() => sidewaysOverflow(page)).toBe(0);
      });
    }
  });
}
