import { expect, type Page, test } from '@playwright/test';
import { sidewaysOverflow } from './accessibility';

const STORE_ID = '6f1d3c2a-8b4e-4f7a-9c1d-2e3f4a5b6c7d';
const EXAMPLE_FUNNEL =
  '[{"type":"page","path":"/calculator"},{"type":"event","name":"calculator_result_shown"},{"type":"page","path":"/sign-up"}]';

const MIN_PHONE_FIELD_FONT_PX = 16;
const DESKTOP_FIELD_FONT_PX = 14;

const PHONE_SIZES = [
  { name: '320×640 portrait', width: 320, height: 640 },
  { name: '844×390 landscape', width: 844, height: 390 },
] as const;

const DEMO_ROUTES = [
  { heading: 'Overview', path: `/${STORE_ID}/overview` },
  {
    heading: 'Funnel',
    path: `/${STORE_ID}/funnel?steps=${encodeURIComponent(EXAMPLE_FUNNEL)}`,
  },
  { heading: 'Features', path: `/${STORE_ID}/features` },
  { heading: 'Requests', path: `/${STORE_ID}/requests` },
  { heading: 'Timeline', path: `/${STORE_ID}/timeline?user=u_7f3a` },
  { heading: 'Visits', path: `/${STORE_ID}/visits` },
  { heading: 'Devices', path: `/${STORE_ID}/devices` },
  { heading: 'Acquisition', path: `/${STORE_ID}/acquisition` },
  { heading: 'Sign in to Pyxis', path: '/sign-in' },
] as const;

for (const size of PHONE_SIZES) {
  test.describe(`at ${size.name}`, () => {
    test.use({ viewport: { width: size.width, height: size.height } });

    for (const route of DEMO_ROUTES) {
      test(`${route.heading} never scrolls sideways once the page has hydrated`, async ({
        page,
      }) => {
        await page.goto(route.path);
        await expect(page.getByRole('heading', { level: 1, name: route.heading })).toBeVisible();
        await page.waitForLoadState('networkidle');

        await expect.poll(() => sidewaysOverflow(page)).toBe(0);
      });
    }
  });
}

const CHART_PANELS = [
  { heading: 'Overview', path: `/${STORE_ID}/overview`, panel: 'Activity per day' },
  { heading: 'Acquisition', path: `/${STORE_ID}/acquisition`, panel: 'Visits by channel' },
] as const;
const CHART_RANGES = ['7d', '30d'] as const;

test.describe('at 320×640 portrait, the chart date labels', () => {
  test.use({ viewport: { width: 320, height: 640 } });

  for (const chart of CHART_PANELS) {
    for (const range of CHART_RANGES) {
      test(`of ${chart.heading} over ${range} never overlap nor leave the chart`, async ({
        page,
      }) => {
        await page.goto(`${chart.path}?range=${range}`);
        const figure = page.getByRole('region', { name: chart.panel }).getByRole('img');
        await expect(figure).toBeVisible();

        const boxes = await figure.locator('div.absolute > span:visible').evaluateAll((labels) =>
          labels.map((label) => {
            const { left, right } = label.getBoundingClientRect();
            return { left, right };
          }),
        );
        const frame = await figure.boundingBox();
        const gaps = boxes
          .slice(1)
          .map((box, index) => box.left - (boxes[index]?.right ?? Number.POSITIVE_INFINITY));

        expect(boxes.length).toBeGreaterThanOrEqual(2);
        expect(Math.min(...gaps)).toBeGreaterThan(0);
        expect(Math.min(...boxes.map((box) => box.left))).toBeGreaterThanOrEqual(
          frame?.x ?? Number.NaN,
        );
        expect(Math.max(...boxes.map((box) => box.right))).toBeLessThanOrEqual(
          (frame?.x ?? Number.NaN) + (frame?.width ?? Number.NaN),
        );
      });
    }
  }
});

const FORM_SCREENS = [
  { name: 'Visits', path: `/${STORE_ID}/visits`, open: 'Filters' },
  { name: 'Timeline', path: `/${STORE_ID}/timeline` },
  { name: 'Features', path: `/${STORE_ID}/features` },
  { name: 'Sign in', path: '/sign-in' },
  { name: 'Funnel', path: `/${STORE_ID}/funnel`, open: 'Edit steps' },
  { name: 'Overview', path: `/${STORE_ID}/overview`, open: 'Custom' },
] as const;

async function fieldFontSizes(page: Page): Promise<number[]> {
  const fields = page.locator('input:visible, select:visible');
  await expect(fields.first()).toBeVisible();
  return fields.evaluateAll((visible) =>
    visible.map((field) => Number.parseFloat(getComputedStyle(field).fontSize)),
  );
}

test.describe('at 390×844, below the sm breakpoint', () => {
  test.use({ viewport: { width: 390, height: 844 } });

  for (const screen of FORM_SCREENS) {
    test(`${screen.name} fields use 16px text, so iOS does not zoom in on focus`, async ({
      page,
    }) => {
      await page.goto(screen.path);
      if ('open' in screen) {
        await page.getByText(screen.open, { exact: true }).click();
      }

      const sizes = await fieldFontSizes(page);

      expect(Math.min(...sizes)).toBeGreaterThanOrEqual(MIN_PHONE_FIELD_FONT_PX);
    });
  }
});

test.describe('at 1440×900', () => {
  test.use({ viewport: { width: 1440, height: 900 } });

  test('visits fields keep their compact 14px text', async ({ page }) => {
    await page.goto(`/${STORE_ID}/visits`);

    expect(new Set(await fieldFontSizes(page))).toEqual(new Set([DESKTOP_FIELD_FONT_PX]));
  });
});

const SIDEBAR_BUDGET_PX = 700;

test.describe('sidebar on a 1366×768 laptop', () => {
  test.use({ viewport: { width: 1366, height: 768 } });

  test('shows Sign out without scrolling the sidebar', async ({ page, isMobile }) => {
    test.skip(isMobile, 'The sidebar is a menu behind a button on phones.');
    await page.goto(`/${STORE_ID}/overview`);

    const navigation = page.getByRole('navigation', { name: 'Main navigation' });

    await expect(page.getByRole('button', { name: 'Sign out' })).toBeInViewport({ ratio: 1 });
    expect(await navigation.evaluate((element) => element.scrollHeight)).toBeLessThanOrEqual(768);
  });
});

test.describe(`sidebar in ${String(SIDEBAR_BUDGET_PX)}px of height`, () => {
  test.use({ viewport: { width: 1280, height: SIDEBAR_BUDGET_PX } });

  test('needs no inner scroll', async ({ page, isMobile }) => {
    test.skip(isMobile, 'The sidebar is a menu behind a button on phones.');
    await page.goto(`/${STORE_ID}/overview`);

    const navigation = page.getByRole('navigation', { name: 'Main navigation' });

    expect(await navigation.evaluate((element) => element.scrollHeight)).toBeLessThanOrEqual(
      SIDEBAR_BUDGET_PX,
    );
  });
});
