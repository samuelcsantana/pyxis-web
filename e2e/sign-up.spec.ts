import { expect, test } from '@playwright/test';
import { axeViolations, sidewaysOverflow } from './accessibility';

for (const colorScheme of ['light', 'dark'] as const) {
  test.describe(`sign-up, ${colorScheme} theme`, () => {
    test.use({ colorScheme });

    test('has no WCAG 2.2 A or AA violation and never scrolls sideways', async ({ page }) => {
      await page.goto('/sign-up');
      await expect(
        page.getByRole('heading', { level: 1, name: 'Start your free trial' }),
      ).toBeVisible();

      expect(await axeViolations(page)).toEqual([]);
      expect(await sidewaysOverflow(page)).toBe(0);
    });

    test('says the day’s limit of new sign-ups was reached, with the support address', async ({
      page,
    }) => {
      await page.goto('/sign-up');
      await page.getByRole('textbox', { name: 'E-mail' }).fill('busy@example.com');
      await page.getByRole('checkbox', { name: /I have read and accept/ }).check();
      await page.getByRole('button', { name: 'Send code' }).click();

      const alert = page.getByRole('main').getByRole('alert');
      await expect(alert).toHaveText(
        'We reached today’s limit of new sign-ups. Try again in a few hours, or write to hello@pyxis-analytics.dev.',
      );
      await expect(alert.getByRole('link', { name: 'hello@pyxis-analytics.dev' })).toHaveAttribute(
        'href',
        'mailto:hello@pyxis-analytics.dev',
      );
      await expect(
        page.getByRole('heading', { level: 1, name: 'Start your free trial' }),
      ).toBeVisible();
      expect(await axeViolations(page)).toEqual([]);
      expect(await sidewaysOverflow(page)).toBe(0);
    });
  });
}

test('signs up with the demo code and lands on the welcome page', async ({ page }) => {
  await page.goto('/sign-up');
  await expect(page.getByText('One free trial per customer.')).toBeVisible();

  await page.getByRole('button', { name: 'Yearly' }).click();
  await page.getByRole('textbox', { name: 'E-mail' }).fill('ana@example.com');
  await page.getByRole('button', { name: 'Send code' }).click();
  await expect(page.getByRole('main').getByRole('alert')).toHaveText(
    'Accept the terms to continue.',
  );

  await page.getByRole('checkbox', { name: /I have read and accept/ }).check();
  await page.getByRole('button', { name: 'Send code' }).click();
  await expect(page.getByRole('heading', { level: 1, name: 'Check your e-mail' })).toBeVisible();
  expect(await axeViolations(page)).toEqual([]);

  await page.getByRole('button', { name: 'Use 000000' }).click();

  await expect(page).toHaveURL(/\/welcome\?account=/);
  await expect(page.getByRole('main').getByRole('status')).toContainText(
    'Your subscription is confirmed.',
  );
  expect(await axeViolations(page)).toEqual([]);
  await page.getByRole('link', { name: 'Create your first project' }).click();
  await expect(page).toHaveURL(/\/new-project$/);
});

test('speaks Portuguese', async ({ page, context, baseURL }) => {
  await context.addCookies([{ name: 'pyxis_locale', value: 'pt-BR', url: baseURL ?? '' }]);

  await page.goto('/sign-up');

  await expect(
    page.getByRole('heading', { level: 1, name: 'Comece o teste grátis' }),
  ).toBeVisible();
  await expect(page.getByText('Um teste grátis por cliente.')).toBeVisible();
});
