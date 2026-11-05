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
  });
}

test('lists the demo links with their dates, the expired one marked', async ({ page }) => {
  await openShareSettings(page);
  const rows = shareSettings(page).getByRole('listitem');

  await expect(rows).toHaveCount(2);
  await expect(rows.first()).toContainText('Agency pitch');
  await expect(rows.first()).toContainText('Expired');
  await expect(rows.last()).toContainText('Monthly board report');
  await expect(rows.last()).toContainText('Never expires');
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
  await expect(section.getByRole('button', { name: 'Revoke' })).toHaveCount(2);

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
