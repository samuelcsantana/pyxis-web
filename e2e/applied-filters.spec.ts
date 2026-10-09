import { expect, type Page, test } from '@playwright/test';
import { axeViolations } from './accessibility';

const STORE_ID = '6f1d3c2a-8b4e-4f7a-9c1d-2e3f4a5b6c7d';

const applied = (page: Page) => page.getByRole('region', { name: 'Applied filters' });

test('lists the applied filters above the visits, each removable on its own', async ({ page }) => {
  await page.goto(`/${STORE_ID}/visits?range=30d&channel=paid&event=signup_completed`);

  await expect(applied(page).getByRole('listitem')).toHaveText([
    'Had event: signup_completed',
    'Channel: Paid',
  ]);
  expect(await axeViolations(page)).toEqual([]);

  await applied(page).getByRole('link', { name: 'Remove Channel: Paid' }).click();

  await expect(page).not.toHaveURL(/channel=/);
  await expect(page).toHaveURL(/event=signup_completed/);
  await expect(applied(page).getByRole('listitem')).toHaveText(['Had event: signup_completed']);
});

test('clears every applied filter at once, keeping the period', async ({ page }) => {
  await page.goto(`/${STORE_ID}/visits?range=7d&channel=paid&failed=true`);
  await expect(applied(page).getByRole('listitem')).toHaveText([
    'Channel: Paid',
    'With a failed request',
  ]);

  await applied(page).getByRole('link', { name: 'Clear all' }).click();

  await expect(page).toHaveURL(/range=7d$/);
  await expect(applied(page)).toHaveCount(0);
});

test('says when the form holds changes not applied yet, and undoes them', async ({ page }) => {
  await page.goto(`/${STORE_ID}/visits?range=30d&channel=paid`);
  const status = page.getByRole('search').getByRole('status');
  const channel = page.getByRole('combobox', { name: 'Channel' });
  const event = page.getByRole('textbox', { name: 'Had event' });
  await expect(status).toBeEmpty();

  await channel.selectOption('email');
  await event.fill('cta_clicked');

  await expect(status).toContainText('Changes not applied yet');
  await expect(channel).toHaveAttribute('data-changed');
  await expect(event).toHaveAttribute('data-changed');
  await expect(applied(page).getByRole('listitem')).toHaveText(['Channel: Paid']);

  await status.getByRole('button', { name: 'Undo' }).click();

  await expect(channel).toHaveValue('paid');
  await expect(event).toHaveValue('');
  await expect(status).toBeEmpty();
  await expect(channel).not.toHaveAttribute('data-changed');
});

test('stops flagging a field typed back to the applied value', async ({ page }) => {
  await page.goto(`/${STORE_ID}/visits?range=30d&country=BR`);
  const status = page.getByRole('search').getByRole('status');
  const country = page.getByRole('textbox', { name: 'Country' });

  await country.fill('US');
  await expect(status).toContainText('Changes not applied yet');
  await country.fill('br');

  await expect(status).toBeEmpty();
  await expect(country).not.toHaveAttribute('data-changed');
});
