import { expect, type Page, test } from '@playwright/test';

const STORE_ID = '6f1d3c2a-8b4e-4f7a-9c1d-2e3f4a5b6c7d';
const STILL = 'none';
const REVEALING = 'reveal';

async function open(page: Page, screen: string): Promise<void> {
  await page.goto(`/${STORE_ID}/${screen}`);
  await expect(page.getByRole('main')).not.toHaveAttribute('aria-busy');
}

const activity = (page: Page) => page.getByRole('region', { name: 'Activity per day' });

test('shows a chart panel still when the page opens, and brings the table in when chosen', async ({
  page,
}) => {
  await open(page, 'overview');
  const content = activity(page).getByTestId('reveal');
  await expect(content).toHaveCSS('animation-name', STILL);

  await activity(page).getByRole('button', { name: 'Table', exact: true }).click();

  await expect(content).toHaveCSS('animation-name', REVEALING);
  await expect(content.getByRole('table')).toBeVisible();
  await expect(content).toHaveCSS('opacity', '1');
});

test('brings the routes in when the requests filter changes, leaving the figures still', async ({
  page,
}) => {
  await open(page, 'requests');
  const sections = page.getByRole('main').getByTestId('reveal');

  await page
    .getByRole('navigation', { name: 'Show' })
    .getByRole('link', { name: 'Failing only' })
    .click();

  await expect(page).toHaveURL(/show=failing/);
  await expect(sections.first()).toHaveCSS('animation-name', STILL);
  await expect(sections.last()).toHaveCSS('animation-name', REVEALING);
});

test('brings the screens in when the features tab changes', async ({ page }) => {
  await open(page, 'features');

  await page
    .getByRole('navigation', { name: 'Feature kind' })
    .getByRole('link', { name: 'Screens' })
    .click();

  await expect(page).toHaveURL(/kind=screens/);
  await expect(page.getByRole('main').getByTestId('reveal')).toHaveCSS('animation-name', REVEALING);
});

test.describe('with reduced motion', () => {
  test.use({ reducedMotion: 'reduce' });

  test('switches a chart panel without moving', async ({ page }) => {
    await open(page, 'overview');

    await activity(page).getByRole('button', { name: 'Table', exact: true }).click();

    await expect(activity(page).getByRole('table')).toBeVisible();
    await expect(activity(page).getByTestId('reveal')).toHaveCSS('animation-name', STILL);
  });
});
