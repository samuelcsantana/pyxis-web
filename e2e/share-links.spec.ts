import { expect, type Page, test } from '@playwright/test';
import { axeViolations, sidewaysOverflow } from './accessibility';

const STORE_ID = '6f1d3c2a-8b4e-4f7a-9c1d-2e3f4a5b6c7d';
const OVERVIEW = `/${STORE_ID}/overview`;

function shareSettings(page: Page) {
  return page
    .getByRole('dialog', { name: 'Settings' })
    .getByRole('region', { name: 'Public link' });
}

async function openShareSettings(page: Page) {
  await page.goto(`${OVERVIEW}#settings/share`);
  await expect(shareSettings(page).getByRole('button', { name: 'Create link' })).toBeVisible();
}

for (const colorScheme of ['light', 'dark'] as const) {
  test.describe(`public link settings, ${colorScheme} theme`, () => {
    test.use({ colorScheme });

    test('the public link section and its revoke question have no WCAG 2.2 A or AA violation', async ({
      page,
    }) => {
      await openShareSettings(page);
      expect(await axeViolations(page)).toEqual([]);
      expect(await sidewaysOverflow(page)).toBe(0);

      await shareSettings(page).getByRole('button', { name: 'Revoke' }).first().click();
      await expect(
        shareSettings(page).getByRole('button', { name: 'Revoke the link' }),
      ).toBeFocused();
      expect(await axeViolations(page)).toEqual([]);
    });

    test('the password form and its remove question have no WCAG 2.2 A or AA violation', async ({
      page,
    }) => {
      await openShareSettings(page);
      const section = shareSettings(page);

      await section.getByRole('button', { name: 'Set password' }).first().click();
      await expect(section.getByLabel('New password')).toBeFocused();
      expect(await axeViolations(page)).toEqual([]);

      await section.getByRole('button', { name: 'Cancel' }).click();
      await section.getByRole('button', { name: 'Remove password' }).click();
      expect(await axeViolations(page)).toEqual([]);
    });
  });
}

test('lists the demo links with their dates, the expired one and the protected one marked', async ({
  page,
}) => {
  await openShareSettings(page);
  const rows = shareSettings(page).getByRole('listitem');

  await expect(rows).toHaveCount(3);
  await expect(rows.nth(0)).toContainText('Agency pitch');
  await expect(rows.nth(0)).toContainText('Expired');
  await expect(rows.nth(1)).toContainText('Monthly board report');
  await expect(rows.nth(1)).toContainText('Never expires');
  await expect(rows.nth(2)).toContainText('Investor update');
  await expect(rows.nth(2).getByText('Password', { exact: true })).toBeVisible();
});

test('sets a password on a link, checking its length first, and removes it after confirming', async ({
  page,
}) => {
  await openShareSettings(page);
  const board = shareSettings(page).getByRole('listitem').nth(1);

  await board.getByRole('button', { name: 'Set password' }).click();
  await board.getByLabel('New password').fill('short');
  await board.getByRole('button', { name: 'Save password' }).click();
  await expect(board.getByRole('alert')).toHaveText('A password has at least 8 characters.');

  await board.getByLabel('New password').fill('open sesame');
  await board.getByRole('button', { name: 'Save password' }).click();
  await expect(board.getByRole('status')).toHaveText('Password saved.');
  await expect(board.getByText('Password', { exact: true })).toBeVisible();

  await board.getByRole('button', { name: 'Remove password' }).click();
  await board.getByRole('group').getByRole('button', { name: 'Remove password' }).click();
  await expect(board.getByRole('status')).toHaveText('Password removed.');
  await expect(board.getByRole('button', { name: 'Set password' })).toBeVisible();
});

test('creates a link and shows its address once, to copy', async ({
  page,
  context,
  browserName,
}) => {
  test.skip(browserName !== 'chromium', 'clipboard permissions are a Chromium feature');
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  await openShareSettings(page);
  const section = shareSettings(page);

  await section.getByRole('textbox', { name: 'Who it is for' }).fill('Client review');
  await section.getByRole('combobox', { name: 'Expires' }).selectOption('30');
  await section.getByRole('button', { name: 'Create link' }).click();

  const reveal = section.getByRole('group', { name: 'Copy the link now' });
  await expect(reveal).toContainText('This is the only time the link is shown');
  await reveal.getByRole('button', { name: 'Copy' }).click();
  await expect(reveal.getByRole('button', { name: 'Copied' })).toBeVisible();
  expect(await page.evaluate(() => navigator.clipboard.readText())).toMatch(
    /^http:\/\/[^/]+\/share\/pyxis_sh_[A-Za-z0-9]{32}$/,
  );
  await reveal.getByRole('button', { name: 'Done' }).click();
  await expect(section.getByRole('textbox', { name: 'Who it is for' })).toBeVisible();
});

test('revokes a link only after the owner confirms', async ({ page }) => {
  await openShareSettings(page);
  const section = shareSettings(page);

  await section.getByRole('button', { name: 'Revoke' }).last().click();
  await section.getByRole('button', { name: 'Cancel' }).click();
  await expect(section.getByRole('button', { name: 'Revoke' })).toHaveCount(3);

  await section.getByRole('button', { name: 'Revoke' }).last().click();
  await section.getByRole('button', { name: 'Revoke the link' }).click();
  await expect(section.getByRole('status')).toHaveText('Revoked');
});

test('shows the public link on the full settings page too', async ({ page }) => {
  await page.goto(`/${STORE_ID}/settings`);

  await expect(
    page.getByRole('region', { name: 'Public link' }).getByRole('button', { name: 'Create link' }),
  ).toBeVisible();
});
