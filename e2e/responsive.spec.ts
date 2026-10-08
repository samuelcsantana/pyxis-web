import { expect, type Page, test } from '@playwright/test';
import { sidewaysOverflow } from './accessibility';

const STORE_ID = '6f1d3c2a-8b4e-4f7a-9c1d-2e3f4a5b6c7d';
const EXAMPLE_FUNNEL =
  '[{"type":"page","path":"/calculator"},{"type":"event","name":"calculator_result_shown"},{"type":"page","path":"/sign-up"}]';

const MIN_PHONE_FIELD_FONT_PX = 16;
const STAT_VALUE_LINE_PX = 28;
const PHONE_CARD_PADDING_PX = 14;
const PHONE_CHART_MIN_PX = 176;
const TABLET_WIDTHS = [768, 1024] as const;
const KPI_COUNT = 4;
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

const HEADER_BUDGETS = [
  { name: '320×640 portrait', width: 320, height: 640, mainTopPx: 330 },
  { name: '390×844 portrait', width: 390, height: 844, mainTopPx: 260 },
  { name: '844×390 landscape', width: 844, height: 390, mainTopPx: 200 },
] as const;

async function mainTop(page: Page): Promise<number> {
  const main = page.locator('main#content:not([aria-busy])');
  await expect(main).toBeVisible();
  return main.evaluate((element) => element.getBoundingClientRect().top + window.scrollY);
}

for (const budget of HEADER_BUDGETS) {
  test.describe(`at ${budget.name}, the page header`, () => {
    test.use({ viewport: { width: budget.width, height: budget.height } });

    for (const route of DEMO_ROUTES.filter(({ path }) => path !== '/sign-in')) {
      test(`of ${route.heading} leaves the content within ${String(budget.mainTopPx)}px of the top`, async ({
        page,
      }) => {
        await page.goto(route.path);
        await expect(page.getByRole('heading', { level: 1, name: route.heading })).toBeVisible();

        expect(await mainTop(page)).toBeLessThanOrEqual(budget.mainTopPx);
      });
    }
  });
}

test.describe('at 320×640, below the sm breakpoint, the period controls', () => {
  test.use({ viewport: { width: 320, height: 640 } });

  test('sit on one row of 44px targets', async ({ page }) => {
    await page.goto(`/${STORE_ID}/overview`);
    const presets = page.getByRole('navigation', { name: 'Period' }).getByRole('link');
    const custom = page.locator('summary', { hasText: 'Custom' });
    await expect(presets).toHaveCount(3);
    await expect(custom).toBeVisible();
    const controls = [...(await presets.all()), custom];

    const boxes = await Promise.all(controls.map((control) => control.boundingBox()));

    expect(new Set(boxes.map((box) => box?.y))).toHaveProperty('size', 1);
    expect(Math.min(...boxes.map((box) => box?.height ?? 0))).toBeGreaterThanOrEqual(44);
  });
});

test.describe('the theme toggle', () => {
  test.use({ viewport: { width: 390, height: 844 }, colorScheme: 'light' });

  test('sits in the menu bar on a phone and agrees with the header one on a wider screen', async ({
    page,
  }) => {
    await page.goto(`/${STORE_ID}/overview`);
    const navigation = page.getByRole('navigation', { name: 'Main navigation' });
    const header = page.getByRole('banner');

    await expect(header.getByRole('button', { name: /^Switch/ })).toBeHidden();
    await navigation.getByRole('button', { name: 'Switch theme' }).click();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
    await expect(navigation.getByRole('button', { name: 'Switch to light theme' })).toBeVisible();

    await page.setViewportSize({ width: 1280, height: 800 });
    await expect(navigation.getByRole('button', { name: /^Switch/ })).toBeHidden();
    await header.getByRole('button', { name: 'Switch to light theme' }).click();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');

    await page.setViewportSize({ width: 390, height: 844 });
    await expect(navigation.getByRole('button', { name: 'Switch to dark theme' })).toBeVisible();
  });
});

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
const WCAG_TEXT_SPACING = `
  * { line-height: 1.5 !important; letter-spacing: 0.12em !important; word-spacing: 0.16em !important; }
  p { margin-bottom: 2em !important; }
`;

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

test.describe('sidebar under WCAG text spacing at 1280×800', () => {
  test.use({ viewport: { width: 1280, height: 800 } });

  test('wraps the account email, the project and its time zone instead of cutting them', async ({
    page,
    isMobile,
  }) => {
    test.skip(isMobile, 'The sidebar is a menu behind a button on phones.');
    await page.goto(`/${STORE_ID}/overview`);
    await page.addStyleTag({ content: WCAG_TEXT_SPACING });

    const switcher = page.locator('summary', { hasText: 'Switch project' });
    for (const text of [
      page.getByText('owner@demo-store.example', { exact: true }),
      switcher.getByText('Demo Store', { exact: true }),
      switcher.getByText('America/Sao_Paulo', { exact: true }),
    ]) {
      const cut = await text.evaluate(
        (element) =>
          element.scrollWidth > element.clientWidth ||
          getComputedStyle(element).textOverflow === 'ellipsis',
      );
      expect(cut).toBe(false);
    }
  });
});

test.describe('at 320×640, below the sm breakpoint, the content', () => {
  test.use({ viewport: { width: 320, height: 640 } });

  test('keeps every Funnel figure on one line', async ({ page }) => {
    await page.goto(`/${STORE_ID}/funnel?steps=${encodeURIComponent(EXAMPLE_FUNNEL)}`);
    await expect(page.getByRole('group', { name: 'Biggest drop-off' })).toBeVisible();

    for (const name of ['Overall conversion', 'Biggest drop-off']) {
      const value = page.getByRole('group', { name }).locator('p').first();
      expect((await value.boundingBox())?.height).toBeLessThanOrEqual(STAT_VALUE_LINE_PX);
    }
  });

  test('gives the Overview chart room to read', async ({ page }) => {
    await page.goto(`/${STORE_ID}/overview`);
    const chart = page.getByRole('region', { name: 'Activity per day' }).getByRole('img');
    await expect(chart).toBeVisible();

    expect((await chart.boundingBox())?.height).toBeGreaterThanOrEqual(PHONE_CHART_MIN_PX);
  });

  test('pads the Timeline cards like the panels', async ({ page }) => {
    await page.goto(`/${STORE_ID}/timeline?user=u_7f3a`);
    const card = page.getByRole('region', { name: /^Visit / }).first();

    await expect(card).toHaveCSS('padding-left', `${String(PHONE_CARD_PADDING_PX)}px`);
  });

  test('says how many visits converted under each source rate', async ({ page }) => {
    await page.goto(`/${STORE_ID}/acquisition?range=30d`);
    const sources = page.getByRole('table', { name: 'Sources' });

    await expect(sources.getByText(/ converted$/).first()).toBeVisible();
  });
});

for (const width of TABLET_WIDTHS) {
  test.describe(`at ${String(width)}px, the tablet grids`, () => {
    test.use({ viewport: { width, height: 900 } });

    test('put the KPI cards two by two', async ({ page }) => {
      await page.goto(`/${STORE_ID}/overview`);
      const cards = page
        .getByRole('main')
        .getByRole('group')
        .filter({ has: page.getByRole('heading') });
      await expect(cards).toHaveCount(KPI_COUNT);

      const tops = await Promise.all(
        (await cards.all()).map(async (card) => (await card.boundingBox())?.y),
      );

      expect(new Set(tops)).toHaveProperty('size', KPI_COUNT / 2);
    });

    test('give the last donut the whole row', async ({ page }) => {
      await page.goto(`/${STORE_ID}/devices`);
      const first = page.getByRole('region', { name: 'Device type' });
      const last = page.getByRole('region', { name: 'Operating system' });
      await expect(last).toBeVisible();

      const [firstBox, lastBox] = await Promise.all([first.boundingBox(), last.boundingBox()]);

      expect(lastBox?.y).toBeGreaterThan(firstBox?.y ?? 0);
      expect(lastBox?.width).toBeGreaterThan((firstBox?.width ?? 0) * 2);
    });
  });
}
