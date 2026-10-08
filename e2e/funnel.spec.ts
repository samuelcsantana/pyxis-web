import { expect, test } from '@playwright/test';
import { axeViolations, sidewaysOverflow } from './accessibility';

const STORE_ID = '6f1d3c2a-8b4e-4f7a-9c1d-2e3f4a5b6c7d';

for (const colorScheme of ['light', 'dark'] as const) {
  test.describe(`funnel, ${colorScheme} theme`, () => {
    test.use({ colorScheme });

    test('has no WCAG 2.2 A or AA violation, also while editing', async ({ page }) => {
      await page.goto(`/${STORE_ID}/funnel`);
      await expect(page.getByRole('list', { name: 'Funnel' })).toBeVisible();

      expect(await axeViolations(page)).toEqual([]);

      await page.getByRole('button', { name: 'Edit steps' }).click();
      await page.getByRole('textbox', { name: 'Step 1 page path' }).fill('calculator');
      await expect(page.getByText('A page path starts with "/".')).toBeVisible();
      expect(await axeViolations(page)).toEqual([]);
      expect(await sidewaysOverflow(page)).toBe(0);
    });
  });
}

test('round-trips an edited funnel through the URL', async ({ page }) => {
  await page.goto(`/${STORE_ID}/funnel?range=30d`);
  await page.getByRole('button', { name: 'Edit steps' }).click();
  for (const position of [6, 5, 4, 3]) {
    await page.getByRole('button', { name: `Remove step ${String(position)}` }).click();
  }

  await page.getByRole('textbox', { name: 'Step 1 page path' }).fill('/pricing');
  await page.getByRole('textbox', { name: 'Step 2 event name' }).fill('cta_clicked');
  await page.getByRole('button', { name: 'Add step' }).click();
  await page.getByRole('textbox', { name: 'Step 3 event name' }).fill('signup_completed');
  await page.getByRole('button', { name: 'Apply' }).click();

  await expect(page).toHaveURL(/steps=/);
  const steps = page.getByRole('list', { name: 'Funnel' }).getByRole('listitem');
  await expect(steps).toHaveCount(3);
  await expect(steps.nth(2)).toContainText('Signup completed');

  await page.reload();
  await expect(steps).toHaveCount(3);
  await page.getByRole('button', { name: 'Edit steps' }).click();
  await expect(page.getByRole('textbox', { name: 'Step 1 page path' })).toHaveValue('/pricing');

  await page
    .getByRole('navigation', { name: 'Period' })
    .getByRole('link', { name: '7 days' })
    .click();
  await expect(page).toHaveURL(/range=7d/);
  await expect(steps).toHaveCount(3);
});

test('reorders the steps with the keyboard alone', async ({ page }) => {
  await page.goto(`/${STORE_ID}/funnel`);
  await expect(page.getByRole('list', { name: 'Funnel' })).toBeVisible();
  await page.getByRole('button', { name: 'Edit steps' }).click();

  await page.getByRole('button', { name: 'Move step 1 down' }).focus();
  await page.keyboard.press('Enter');

  await expect(page.getByRole('button', { name: 'Move step 2 down' })).toBeFocused();
  await expect(page.getByRole('textbox', { name: 'Step 2 page path' })).toHaveValue('/calculator');
  await page.keyboard.press('Shift+Tab');
  await page.keyboard.press('Enter');
  await expect(page.getByRole('textbox', { name: 'Step 1 page path' })).toHaveValue('/calculator');

  await page.getByRole('button', { name: 'Apply' }).click();
  await expect(
    page.getByRole('list', { name: 'Funnel' }).getByRole('listitem').first(),
  ).toContainText('Opened /calculator');
});

test('switches between per visit and per person and keeps the steps', async ({ page }) => {
  await page.goto(`/${STORE_ID}/funnel`);
  await expect(page.getByRole('list', { name: 'Funnel' })).toBeVisible();

  await page.getByRole('link', { name: 'Per person' }).click();

  await expect(page).toHaveURL(/mode=user/);
  await expect(page.getByRole('list', { name: 'Funnel' }).getByRole('listitem')).toHaveCount(6);
  await expect(page.getByText(/Per person: steps can span visits/)).toBeVisible();
});

test('times each step after the one before, and the whole funnel', async ({ page }) => {
  await page.goto(`/${STORE_ID}/funnel?range=30d`);
  const steps = page.getByRole('list', { name: 'Funnel' }).getByRole('listitem');
  await expect(steps).toHaveCount(6);

  await expect(steps.first()).not.toContainText('after the step before');
  for (const step of (await steps.all()).slice(1)) {
    await expect(step).toContainText(/median .+ after the step before/);
  }
  await expect(page.getByRole('group', { name: 'Median time to finish' })).toContainText(
    'from step 1 to step 6',
  );
  expect(await sidewaysOverflow(page)).toBe(0);
});

test('lists the visits that left before a step, as many as it lost, and opens one', async ({
  page,
}) => {
  await page.goto(`/${STORE_ID}/funnel?range=30d`);
  const steps = page.getByRole('list', { name: 'Funnel' }).getByRole('listitem');
  await expect(steps).toHaveCount(6);
  const dropped = steps.nth(1).getByRole('link', { name: /dropped, list who left before step 2$/ });
  const lost = Number(((await dropped.textContent()) ?? '').replace(/\D/g, ''));

  await dropped.click();

  await expect(page).toHaveURL(/step=2&outcome=dropped#funnel-subjects$/);
  const list = page.getByRole('region', { name: /visits? reached step 1 and never step 2$/ });
  await expect(list.getByRole('heading', { level: 2 })).toHaveText(
    new RegExp(`^${lost.toLocaleString('en-US')} visits? `),
  );
  await expect(list).toBeInViewport();
  await expect(dropped).toHaveAttribute('aria-current', 'true');
  const rows = list.getByRole('row');
  await expect(rows).toHaveCount(Math.min(lost, 50) + 1);
  expect(await axeViolations(page)).toEqual([]);
  expect(await sidewaysOverflow(page)).toBe(0);

  let listed = (await rows.count()) - 1;
  const older = list.getByRole('link', { name: 'Show older' });
  while ((await older.count()) > 0) {
    const cursor = new URL((await older.getAttribute('href')) ?? '', page.url()).searchParams.get(
      'cursor',
    );
    await older.click();
    await page.waitForURL((url) => url.searchParams.get('cursor') === cursor);
    await expect(page.getByRole('main')).not.toHaveAttribute('aria-busy', 'true');
    await expect(list.getByRole('link', { name: 'Back to the newest' })).toBeVisible();
    listed += (await rows.count()) - 1;
  }
  expect(listed).toBe(lost);

  const first = list.getByRole('link', { name: /, open this visit in the timeline$/ }).first();
  const visit = ((await first.textContent()) ?? '').trim();
  await first.click();
  await expect(page.getByRole('heading', { name: `Visit ${visit}`, exact: true })).toBeVisible();
});

test('lists the people of a step and closes the list', async ({ page }) => {
  await page.goto(`/${STORE_ID}/funnel?range=30d&mode=user&step=1&outcome=reached`);
  const list = page.getByRole('region', { name: /(person|people) reached step 1$/ });
  await expect(list.getByRole('columnheader', { name: 'Person' })).toBeVisible();
  await expect(
    list.getByRole('link', { name: /, open the timeline of this person$/ }).first(),
  ).toHaveAttribute('href', /\/timeline\?range=30d&user=/);

  await list.getByRole('link', { name: 'Close the list' }).click();

  await expect(page).not.toHaveURL(/outcome=/);
  await expect(page.getByRole('region', { name: /reached step/ })).toHaveCount(0);
});
