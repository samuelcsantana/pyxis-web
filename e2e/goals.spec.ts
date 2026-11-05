import { expect, type Page, test } from '@playwright/test';
import { axeViolations, sidewaysOverflow } from './accessibility';

const STORE_ID = '6f1d3c2a-8b4e-4f7a-9c1d-2e3f4a5b6c7d';
const DOCS_ID = '0c9b8a7d-6e5f-4a3b-8c2d-1e0f9a8b7c6d';
const PRICING_GOAL = 'b1e2c3d4-5f60-4a71-8b92-a3c4d5e6f703';
const OVERVIEW = `/${STORE_ID}/overview?range=30d`;

function conversionsCard(page: Page) {
  return page.getByRole('group', { name: 'Conversions' });
}

function goalsTable(page: Page) {
  return page.getByRole('region', { name: 'Goals' });
}

function goalsSettings(page: Page) {
  return page.getByRole('dialog', { name: 'Settings' }).getByRole('region', { name: 'Goals' });
}

async function openGoalsSettings(page: Page) {
  await page.goto(`${OVERVIEW}#settings/goals`);
  await expect(goalsSettings(page).getByRole('button', { name: 'Add a goal' })).toBeVisible();
}

for (const colorScheme of ['light', 'dark'] as const) {
  test.describe(`goals, ${colorScheme} theme`, () => {
    test.use({ colorScheme });

    test('the goal picker, the Goals table and the goals settings have no WCAG 2.2 A or AA violation', async ({
      page,
    }) => {
      await page.goto(OVERVIEW);
      await expect(goalsTable(page)).toBeVisible();
      expect(await axeViolations(page)).toEqual([]);
      expect(await sidewaysOverflow(page)).toBe(0);

      await openGoalsSettings(page);
      const goals = goalsSettings(page);
      await goals.getByRole('button', { name: 'Add a goal' }).click();
      await goals.getByRole('button', { name: 'Add goal' }).click();
      await expect(goals.getByRole('textbox', { name: 'Name', exact: true })).toHaveAttribute(
        'aria-invalid',
        'true',
      );
      expect(await axeViolations(page)).toEqual([]);
    });
  });
}

test('picks the goal counted on the Conversions card and keeps it in the address', async ({
  page,
}) => {
  await page.goto(OVERVIEW);
  const card = conversionsCard(page);
  await expect(card).toContainText('reached Sign-up');

  await card
    .getByRole('combobox', { name: 'Goal counted as conversions' })
    .selectOption({ label: 'Saw the pricing' });

  await expect(page).toHaveURL(new RegExp(`goal=${PRICING_GOAL}`));
  await expect(card).toContainText('reached Saw the pricing');
  await page.reload();
  await expect(card.getByRole('combobox', { name: 'Goal counted as conversions' })).toHaveValue(
    PRICING_GOAL,
  );
});

test('opens the visits that reached a goal from the Goals table, with the same count', async ({
  page,
}) => {
  await page.goto(OVERVIEW);
  const row = goalsTable(page).getByRole('row', { name: /Saw the pricing/ });
  const counted = (await row.getByRole('cell').first().textContent()) ?? '';

  await row.getByRole('link', { name: 'Saw the pricing: see its visits' }).click();

  await expect(page).toHaveURL(new RegExp(`/visits\\?range=30d&reached_goal=${PRICING_GOAL}`));
  await expect(page.getByText(`${counted} matching visits`, { exact: true })).toBeVisible();
  await expect(
    page.getByRole('region', { name: 'Applied filters' }).getByRole('listitem'),
  ).toHaveText(['Reached goal: Saw the pricing']);
});

test('filters every screen by a reached goal, named in the filter row', async ({ page }) => {
  await page.goto(OVERVIEW);
  await goalsTable(page).getByRole('link', { name: 'Filter by Saw the pricing' }).click();

  await expect(page).toHaveURL(new RegExp(`/overview\\?range=30d&reached_goal=${PRICING_GOAL}`));
  const filters = page.getByRole('region', { name: 'Filters' });
  await expect(filters).toContainText('Reached goal: Saw the pricing');

  await page.goto(`/${STORE_ID}/acquisition?range=30d&reached_goal=${PRICING_GOAL}`);
  await expect(filters).toContainText('Reached goal: Saw the pricing');
});

test('chooses a reached goal in the visit filters', async ({ page, isMobile }) => {
  await page.goto(`/${STORE_ID}/visits?range=30d`);
  if (isMobile) {
    await page.getByRole('button', { name: 'Filters' }).click();
  }

  await page.getByRole('combobox', { name: 'Reached goal' }).selectOption({ label: 'Sign-up' });
  await page.getByRole('button', { name: 'Apply filters' }).click();

  await expect(page).toHaveURL(/reached_goal=b1e2c3d4-5f60-4a71-8b92-a3c4d5e6f701/);
  await expect(page.getByText(/^[\d,]+ matching visits?$/)).toBeVisible();
});

test('adds a goal in the settings, after naming what is wrong', async ({ page }) => {
  await openGoalsSettings(page);
  const dialog = goalsSettings(page);

  await dialog.getByRole('button', { name: 'Add a goal' }).click();
  await dialog.getByRole('textbox', { name: 'Name', exact: true }).fill('Thank-you page');
  await dialog.getByRole('radio', { name: 'A page the visit opens' }).check();
  await dialog.getByRole('textbox', { name: 'Page path' }).fill('thank-you');
  await dialog.getByRole('button', { name: 'Add goal' }).click();
  await expect(dialog.getByRole('alert')).toHaveText('A page path starts with /.');

  await dialog.getByRole('textbox', { name: 'Page path' }).fill('/thank-you/*');
  await dialog.getByRole('button', { name: 'Add goal' }).click();

  await expect(dialog.getByRole('status')).toHaveText('Goal added.');
  await expect(dialog.getByRole('listitem').filter({ hasText: 'Thank-you page' })).toContainText(
    'Page /thank-you/*',
  );
  await expect(dialog.getByText('5 of 10 goals')).toBeVisible();
});

test('says how to count conversions for a project without goals', async ({ page }) => {
  await page.goto(`/${DOCS_ID}/overview?range=30d`);

  await expect(page.getByText(/This project has no goals yet/)).toBeVisible();
  await expect(conversionsCard(page)).toHaveCount(0);
  await page.getByRole('link', { name: 'Add a goal' }).click();

  await expect(goalsSettings(page)).toContainText('No goals yet. Add one');
});
