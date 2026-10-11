import { expect, type Page, test } from '@playwright/test';
import { axeViolations, sidewaysOverflow } from './accessibility';

const DEMO_PROJECT_PATH = /\/6f1d3c2a-8b4e-4f7a-9c1d-2e3f4a5b6c7d\/overview$/;

for (const colorScheme of ['light', 'dark'] as const) {
  test.describe(`sign-in page, ${colorScheme} theme`, () => {
    test.use({ colorScheme });

    test('has no WCAG 2.2 A or AA violation on either step', async ({ page }) => {
      await page.goto('/sign-in?expired=1');
      expect(await axeViolations(page)).toEqual([]);

      await page.getByLabel('Email').fill('owner@demo-store.example');
      await page.getByRole('button', { name: 'Send code' }).click();
      await expect(page.getByLabel('6-digit code')).toBeFocused();

      expect(await axeViolations(page)).toEqual([]);
      expect(await sidewaysOverflow(page)).toBe(0);
    });
  });
}

test('tells a visitor whose session ended why they are here', async ({ page }) => {
  await page.goto('/sign-in?expired=1');

  await expect(page.getByRole('status')).toHaveText(
    'Your session ended. Sign in again to continue.',
  );
});

test('refuses a wrong code, then signs in with the demo code', async ({ page }) => {
  await page.goto('/sign-in');
  await page.getByLabel('Email').fill('owner@demo-store.example');
  await page.getByRole('button', { name: 'Send code' }).click();

  await expect(page.getByRole('heading', { name: 'Check your email' })).toBeVisible();
  await expect(page.getByText('Code sent.')).toBeVisible();

  const code = page.getByLabel('6-digit code');
  await code.fill('123456');
  await expect(page.locator('#sign-in-error')).toContainText('Invalid or expired code');
  await expect(code).toBeFocused();
  expect(await code.evaluate((field: HTMLInputElement) => field.selectionEnd)).toBe(6);

  await page.keyboard.type('000000');

  await expect(page).toHaveURL(DEMO_PROJECT_PATH);
  await expect(page.getByRole('heading', { level: 1, name: 'Overview' })).toBeVisible();
});

test.describe('pasting the code', () => {
  test.use({ permissions: ['clipboard-read', 'clipboard-write'] });

  for (const pasted of [' 000 000 ', '000-000', 'Code: 000000']) {
    test(`signs in with all six digits of "${pasted}"`, async ({ page }) => {
      await page.goto('/sign-in');
      await page.getByLabel('Email').fill('owner@demo-store.example');
      await page.getByRole('button', { name: 'Send code' }).click();
      await expect(page.getByLabel('6-digit code')).toBeFocused();

      await page.evaluate((text) => navigator.clipboard.writeText(text), pasted);
      await page.keyboard.press('ControlOrMeta+V');

      await expect(page).toHaveURL(DEMO_PROJECT_PATH);
    });
  }
});

test('shows each typed digit in its own cell and waits for the sixth', async ({ page }) => {
  await page.goto('/sign-in');
  await page.getByLabel('Email').fill('owner@demo-store.example');
  await page.getByRole('button', { name: 'Send code' }).click();
  await expect(page.getByLabel('6-digit code')).toBeFocused();

  await page.keyboard.type('00000');

  await expect(page.getByTestId('code-cells')).toHaveText('00000');
  await expect(page.getByRole('heading', { name: 'Check your email' })).toBeVisible();

  await page.keyboard.type('0');

  await expect(page).toHaveURL(DEMO_PROJECT_PATH);
});

test('explains a missing email and an incomplete code itself, not with the browser', async ({
  page,
}) => {
  await page.goto('/sign-in');

  await page.getByRole('button', { name: 'Send code' }).click();
  await expect(page.locator('#sign-in-email-error')).toHaveText('Enter your email.');

  await page.getByLabel('Email').fill('owner@demo-store.example');
  await expect(page.locator('#sign-in-email-error')).toHaveCount(0);
  await page.getByRole('button', { name: 'Send code' }).click();
  await expect(page.getByRole('button', { name: 'Verify and continue' })).toBeEnabled();
  await page.keyboard.type('482');
  await page.keyboard.press('Enter');

  await expect(page.locator('#sign-in-error')).toHaveText('Enter all 6 digits of the code.');
  await expect(page.getByRole('heading', { name: 'Check your email' })).toBeVisible();
});

test('goes back to change the email', async ({ page }) => {
  await page.goto('/sign-in');
  await page.getByLabel('Email').fill('typo@demo-store.example');
  await page.getByRole('button', { name: 'Send code' }).click();

  await page.getByRole('button', { name: 'Change email' }).click();

  await expect(page.getByRole('heading', { name: 'Sign in to Pyxis' })).toBeVisible();
  await expect(page.getByLabel('Email')).toBeFocused();
});

test('stays on the code step through a reload, until the email is changed', async ({ page }) => {
  await page.goto('/sign-in');
  await page.getByLabel('Email').fill('owner@demo-store.example');
  await page.getByRole('button', { name: 'Send code' }).click();
  await expect(page.getByRole('button', { name: /Send a new code in 0:[0-3]\d/ })).toBeDisabled();

  await page.reload();

  await expect(page.getByRole('heading', { name: 'Check your email' })).toBeVisible();
  await expect(page.getByText('owner@demo-store.example')).toBeVisible();
  await expect(page.getByLabel('6-digit code')).toBeFocused();

  await page.getByRole('button', { name: 'Change email' }).click();
  await page.reload();

  await expect(page.getByRole('heading', { name: 'Sign in to Pyxis' })).toBeVisible();
});

test('offers no live demo link inside the live demo', async ({ page }) => {
  await page.goto('/sign-in');

  await expect(page.getByRole('heading', { name: 'Sign in to Pyxis' })).toBeVisible();
  await expect(page.getByRole('link', { name: /See the live demo/ })).toHaveCount(0);
});

test('signs in with the demo code filled in from the hint', async ({ page }) => {
  await page.goto('/sign-in');
  await page.getByLabel('Email').fill('owner@demo-store.example');
  await page.getByRole('button', { name: 'Send code' }).click();

  await page.getByRole('button', { name: 'Fill in 000000' }).click();

  await expect(page).toHaveURL(DEMO_PROJECT_PATH);
});

test('starts the card under the header on a phone, centred on a wide screen', async ({
  page,
  isMobile,
}) => {
  await page.goto('/sign-in');
  const header = await page.getByRole('banner').boundingBox();
  const card = await page.getByRole('heading', { name: 'Sign in to Pyxis' }).boundingBox();
  const viewport = page.viewportSize();
  if (header === null || card === null || viewport === null) {
    throw new Error('the sign-in page did not lay out');
  }

  const gapUnderHeader = card.y - (header.y + header.height);
  if (isMobile) {
    expect(gapUnderHeader).toBeLessThan(80);
  } else {
    expect(card.y).toBeGreaterThan(viewport.height / 4);
  }
});

test('draws the brand backdrop from images the site serves', async ({ page, request }) => {
  await page.goto('/sign-in');

  const masks = await page.getByTestId('brand-backdrop').evaluate((backdrop) => {
    const mark = backdrop.querySelector('.brand-backdrop-mark');
    return {
      dust: getComputedStyle(backdrop, '::before').maskImage,
      needle: mark === null ? '' : getComputedStyle(mark, '::before').maskImage,
    };
  });
  expect(masks.dust).toContain('/brand/star-dust.svg');
  expect(masks.needle).toContain('/brand/brand-needle.svg');

  for (const image of ['/brand/star-dust.svg', '/brand/brand-needle.svg']) {
    const response = await request.get(image);
    expect(response.status()).toBe(200);
    expect(response.headers()['content-type']).toContain('image/svg+xml');
  }
});

test('leaves the focus alone when the page opens', async ({ page }) => {
  await page.goto('/sign-in');

  await expect(page.getByLabel('Email')).not.toBeFocused();
});

async function signInWithTheDemoCode(page: Page) {
  await page.getByLabel('Email').fill('owner@demo-store.example');
  await page.getByRole('button', { name: 'Send code' }).click();
  await page.getByLabel('6-digit code').fill('000000');
}

test('comes back to the screen it was sent from, filters included', async ({ page }) => {
  const screen = '/6f1d3c2a-8b4e-4f7a-9c1d-2e3f4a5b6c7d/requests?show=failing&range=7d';
  await page.goto(`/sign-in?${new URLSearchParams({ next: screen }).toString()}`);

  await signInWithTheDemoCode(page);

  await expect(page).toHaveURL(/\/requests\?show=failing&range=7d$/);
  await expect(page.getByRole('heading', { level: 1, name: 'Requests' })).toBeVisible();
});

test('goes to the projects when asked to come back somewhere else', async ({ page }) => {
  await page.goto('/sign-in?next=%2F%2Fevil.example%2Foverview');

  await signInWithTheDemoCode(page);

  await expect(page).toHaveURL(DEMO_PROJECT_PATH);
});
