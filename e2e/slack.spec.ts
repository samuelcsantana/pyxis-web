import { expect, type Page, test } from '@playwright/test';
import { axeViolations, sidewaysOverflow } from './accessibility';

const STORE_ID = '6f1d3c2a-8b4e-4f7a-9c1d-2e3f4a5b6c7d';
const WEBHOOK_URL = 'https://hooks.slack.com/services/T0001/B0002/abcdefghijklWXYZ';

function slackPanel(page: Page) {
  return page.getByRole('dialog', { name: 'Settings' }).getByRole('region', { name: 'Slack' });
}

async function openSlack(page: Page) {
  await page.goto(`/${STORE_ID}/overview#settings/email`);
  await expect(slackPanel(page).getByText('hooks.slack.com/…/9XQZ')).toBeVisible();
}

for (const colorScheme of ['light', 'dark'] as const) {
  test.describe(`the Slack panel, ${colorScheme} theme`, () => {
    test.use({ colorScheme });

    test('the webhook, its form and its remove question have no WCAG 2.2 A or AA violation', async ({
      page,
    }) => {
      await openSlack(page);
      expect(await axeViolations(page)).toEqual([]);
      expect(await sidewaysOverflow(page)).toBe(0);

      await slackPanel(page).getByRole('button', { name: 'Replace' }).click();
      await slackPanel(page).getByRole('button', { name: 'Save' }).click();
      await expect(slackPanel(page).getByRole('alert')).toBeVisible();
      expect(await axeViolations(page)).toEqual([]);

      await slackPanel(page).getByRole('button', { name: 'Cancel' }).click();
      await slackPanel(page).getByRole('button', { name: 'Remove' }).click();
      expect(await axeViolations(page)).toEqual([]);
    });
  });
}

test('sends a test to the connected channel and says Slack accepted it', async ({ page }) => {
  await openSlack(page);
  const panel = slackPanel(page);

  await expect(panel).toContainText('Connected on');
  await panel.getByRole('button', { name: 'Send test' }).click();

  await expect(panel.getByRole('status')).toHaveText(
    'Slack accepted the test message. Look for it in the channel.',
  );
});

test('replaces the address, checking it first, and never shows it back', async ({ page }) => {
  await openSlack(page);
  const panel = slackPanel(page);

  await panel.getByRole('button', { name: 'Replace' }).click();
  await expect(
    panel.getByRole('link', { name: 'Sending messages using incoming webhooks' }),
  ).toHaveAttribute('href', 'https://api.slack.com/messaging/webhooks');
  const field = panel.getByRole('textbox', { name: 'Webhook address' });
  await field.fill('https://example.com/hook');
  await panel.getByRole('button', { name: 'Save' }).click();
  await expect(panel.getByRole('alert')).toContainText('not a Slack Incoming Webhook address');

  await field.fill(WEBHOOK_URL);
  await panel.getByRole('button', { name: 'Save' }).click();

  await expect(panel.getByText('hooks.slack.com/…/WXYZ')).toBeVisible();
  await expect(panel.getByRole('textbox')).toHaveCount(0);
  expect(await page.content()).not.toContain('abcdefghijkl');
});

test('removes the webhook only after confirming, then offers the form', async ({ page }) => {
  await openSlack(page);
  const panel = slackPanel(page);

  await panel.getByRole('button', { name: 'Remove' }).click();
  await panel.getByRole('button', { name: 'Cancel' }).click();
  await expect(panel.getByText('hooks.slack.com/…/9XQZ')).toBeVisible();

  await panel.getByRole('button', { name: 'Remove' }).click();
  await panel.getByRole('group').getByRole('button', { name: 'Remove' }).click();

  await expect(panel.getByRole('textbox', { name: 'Webhook address' })).toBeVisible();
  await expect(panel.getByText('hooks.slack.com/…/9XQZ')).toHaveCount(0);
});

test('shows the Slack panel on the full settings page too', async ({ page }) => {
  await page.goto(`/${STORE_ID}/settings`);

  await expect(
    page.getByRole('region', { name: 'Slack' }).getByText('hooks.slack.com/…/9XQZ'),
  ).toBeVisible();
});
