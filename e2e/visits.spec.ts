import { expect, type Page, test } from '@playwright/test';
import { axeViolations, sidewaysOverflow } from './accessibility';

const STORE_ID = '6f1d3c2a-8b4e-4f7a-9c1d-2e3f4a5b6c7d';

function visitRows(page: Page) {
  return page.getByRole('table', { name: 'Visits' }).locator('tbody tr');
}

for (const colorScheme of ['light', 'dark'] as const) {
  test.describe(`visits, ${colorScheme} theme`, () => {
    test.use({ colorScheme });

    test('has no WCAG 2.2 A or AA violation, also with older visits and a filter left out', async ({
      page,
    }) => {
      await page.goto(`/${STORE_ID}/visits`);
      await expect(visitRows(page)).toHaveCount(8);

      expect(await axeViolations(page)).toEqual([]);
      expect(await sidewaysOverflow(page)).toBe(0);

      await page.getByRole('button', { name: 'Load older visits' }).click();
      await expect(visitRows(page)).toHaveCount(13);
      expect(await axeViolations(page)).toEqual([]);

      await page.goto(`/${STORE_ID}/visits?property=plan%3Dpro`);
      await expect(
        page.getByRole('search', { name: 'Filter the visits' }).getByRole('alert'),
      ).toContainText('A property filter needs an event.');
      expect(await axeViolations(page)).toEqual([]);
      expect(await sidewaysOverflow(page)).toBe(0);
    });
  });
}

test('filters by two pages through the form and opens the visit in the timeline', async ({
  page,
}) => {
  await page.goto(`/${STORE_ID}/visits?range=30d`);

  await page.getByRole('textbox', { name: 'Viewed page' }).fill('/');
  await page.getByRole('textbox', { name: 'And page' }).fill('/pri*');
  await page.getByRole('button', { name: 'Apply filters' }).click();

  await expect(page).toHaveURL(/range=30d&path=%2F&path2=%2Fpri\*/);
  await expect(visitRows(page)).toHaveCount(1);
  await expect(visitRows(page)).toContainText('Calculator result shown');

  await page.reload();
  await expect(visitRows(page)).toHaveCount(1);

  await page
    .getByRole('navigation', { name: 'Period' })
    .getByRole('link', { name: '7 days' })
    .click();
  await expect(page).toHaveURL(/range=7d&path=%2F&path2=%2Fpri\*$/);
  await expect(visitRows(page)).toHaveCount(1);

  await page.getByRole('link', { name: /, open visit 7e2b9c14$/ }).click();
  await expect(page).toHaveURL(/\/timeline\?visit=7e2b9c14-/);
  await expect(page.getByRole('heading', { name: 'Visit 7e2b9c14', exact: true })).toBeVisible();
});

test('filters by an event with a property and by who the visitor was', async ({ page }) => {
  await page.goto(`/${STORE_ID}/visits`);

  await page.getByRole('textbox', { name: 'Had event' }).fill('calculator_result_shown');
  await page.getByRole('textbox', { name: /^With property/ }).fill('calculator=ifood');
  await page.getByRole('combobox', { name: 'Account' }).selectOption('identified');
  await page.getByRole('button', { name: 'Apply filters' }).click();

  await expect(visitRows(page)).toHaveCount(1);
  await expect(
    visitRows(page).getByRole('link', { name: 'u_7f3a, open the timeline of this user' }),
  ).toBeVisible();

  await page.getByRole('link', { name: 'Clear filters' }).click();
  await expect(page).toHaveURL(/\/visits\?range=30d$/);
  await expect(visitRows(page)).toHaveCount(8);
  await expect(page.getByRole('textbox', { name: 'Had event' })).toHaveValue('');
});

test('loads the older visits with the keyboard and moves the focus to them', async ({ page }) => {
  await page.goto(`/${STORE_ID}/visits`);
  await expect(visitRows(page)).toHaveCount(8);

  await page.getByRole('button', { name: 'Load older visits' }).focus();
  await page.keyboard.press('Enter');

  await expect(visitRows(page)).toHaveCount(13);
  await expect(page.getByRole('link', { name: /, open visit 19c2e5f6$/ })).toBeFocused();
  await expect(page.getByText('That is every visit of this period.')).toBeVisible();
});

test('opens the timeline of the account of a visit', async ({ page }) => {
  await page.goto(`/${STORE_ID}/visits?identity=identified&device=tablet`);

  await page.getByRole('link', { name: 'u_c41e, open the timeline of this user' }).click();

  await expect(page.getByRole('heading', { name: 'User u_c41e' })).toBeVisible();
  await expect(page.getByRole('region', { name: /^Visit 8c3f6a1d · / })).toContainText(
    'Login completed',
  );
});
