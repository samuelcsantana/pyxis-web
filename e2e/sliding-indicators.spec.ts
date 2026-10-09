import { expect, type Locator, type Page, test } from '@playwright/test';
import { openAccountMenu } from './navigation';

const STORE_ID = '6f1d3c2a-8b4e-4f7a-9c1d-2e3f4a5b6c7d';
const ALIGNED_WITHIN_PX = 1;

interface Edges {
  readonly left: number;
  readonly width: number;
  readonly bottom: number;
}

function edgesOf(locator: Locator): Promise<Edges> {
  return locator.evaluate((element) => {
    const box = element.getBoundingClientRect();
    return { left: box.left, width: box.width, bottom: box.bottom };
  });
}

async function misalignment(indicator: Locator, chosen: Locator): Promise<number> {
  const [drawn, target] = await Promise.all([edgesOf(indicator), edgesOf(chosen)]);
  return Math.max(
    Math.abs(drawn.left - target.left),
    Math.abs(drawn.width - target.width),
    Math.abs(drawn.bottom - target.bottom),
  );
}

async function expectIndicatorOn(group: Locator, chosen: Locator): Promise<void> {
  const indicator = group.getByTestId('sliding-indicator');
  await expect.poll(() => misalignment(indicator, chosen)).toBeLessThan(ALIGNED_WITHIN_PX);
}

async function open(page: Page, screen: string): Promise<void> {
  await page.goto(`/${STORE_ID}/${screen}`);
  await expect(page.getByRole('main')).not.toHaveAttribute('aria-busy');
}

test('slides the fill from Chart to Table on a chart panel', async ({ page }) => {
  await open(page, 'overview');
  const views = page
    .getByRole('region', { name: 'Activity per day' })
    .getByRole('group', { name: 'Show as' });
  await expectIndicatorOn(views, views.getByRole('button', { name: 'Chart' }));

  await views.getByRole('button', { name: 'Table' }).click();

  await expectIndicatorOn(views, views.getByRole('button', { name: 'Table' }));
});

test('slides the fill to the clicked requests filter and keeps it there on the new page', async ({
  page,
}) => {
  await open(page, 'requests');
  const filters = page.getByRole('navigation', { name: 'Show' });
  const failing = filters.getByRole('link', { name: 'Failing only' });

  await failing.click();

  await expectIndicatorOn(filters, failing);
  await expect(failing).toHaveAttribute('aria-current', 'page');
  await expectIndicatorOn(filters, failing);
});

test('moves the underline to the clicked feature tab', async ({ page }) => {
  await open(page, 'features');
  const tabs = page.getByRole('navigation', { name: 'Feature kind' });
  await expectIndicatorOn(tabs, tabs.getByRole('link', { name: 'Events' }));

  await tabs.getByRole('link', { name: 'Screens' }).click();

  await expectIndicatorOn(tabs, tabs.getByRole('link', { name: 'Screens' }));
});

test('slides the highlight to the chosen theme in the account menu', async ({ page, isMobile }) => {
  await open(page, 'overview');
  await openAccountMenu(page, isMobile);
  const themes = page.getByRole('group', { name: 'Theme' });

  await themes.getByRole('button', { name: 'Dark' }).click();

  await expectIndicatorOn(themes, themes.getByRole('button', { name: 'Dark' }));
});

test('shows the theme highlight in place as the account menu opens, without sliding in', async ({
  page,
  isMobile,
}) => {
  await open(page, 'overview');
  await openAccountMenu(page, isMobile);
  const themes = page.getByRole('group', { name: 'Theme' });

  const moving = await themes
    .getByTestId('sliding-indicator')
    .evaluate((indicator) => indicator.getAnimations().length);

  expect(moving).toBe(0);
  await expectIndicatorOn(themes, themes.getByRole('button', { name: 'System' }));
});
