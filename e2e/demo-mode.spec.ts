import { expect, test } from '@playwright/test';

const STORE_ID = '6f1d3c2a-8b4e-4f7a-9c1d-2e3f4a5b6c7d';

const SCREENS = [
  { title: 'Overview', path: 'overview' },
  { title: 'Funnel', path: 'funnel' },
  { title: 'Features', path: 'features' },
  { title: 'Requests', path: 'requests' },
  { title: 'Timeline', path: 'timeline?user=u_7f3a' },
  { title: 'Visits', path: 'visits' },
  { title: 'Devices', path: 'devices' },
  { title: 'Acquisition', path: 'acquisition' },
] as const;

test('every screen runs on invented data, with the banner and no call to any API', async ({
  page,
  baseURL,
}) => {
  const outside: string[] = [];
  page.on('request', (request) => {
    if (!request.url().startsWith(baseURL ?? '')) {
      outside.push(request.url());
    }
  });

  for (const screen of SCREENS) {
    await page.goto(`/${STORE_ID}/${screen.path}`);
    await expect(page.getByRole('heading', { level: 1, name: screen.title })).toBeVisible();
    await expect(page.getByRole('note')).toContainText('Demo data');
    await expect(
      page.getByRole('note').getByRole('link', { name: 'Source on GitHub' }),
    ).toHaveAttribute('href', 'https://github.com/samuelcsantana/pyxis-web');
  }

  expect(outside).toEqual([]);
});

test('opens the funnel on the example of the project', async ({ page }) => {
  await page.goto(`/${STORE_ID}/funnel`);

  await expect(page.getByRole('list', { name: 'Funnel' }).getByRole('listitem')).toHaveCount(6);
  await expect(
    page.getByRole('list', { name: 'Funnel' }).getByRole('listitem').first(),
  ).toContainText('Opened /calculator');
});

test('shows the same figures on every screen for the same period', async ({ page }) => {
  const valueOf = (name: string) =>
    page.getByRole('region', { name, exact: true }).locator('p').first();
  await page.goto(`/${STORE_ID}/overview?range=30d`);
  const visits = (await valueOf('Visits').textContent()) ?? '';
  const errorRate = (await valueOf('Write error rate').textContent()) ?? '';

  await page.goto(`/${STORE_ID}/acquisition?range=30d`);
  await expect(page.getByRole('region', { name: 'Paid visits' })).toContainText(
    `of ${visits} visits`,
  );

  await page.goto(`/${STORE_ID}/requests?range=30d`);
  await expect(valueOf('Write error rate')).toHaveText(errorRate);
});

test('allows connections only to its own origin', async ({ request }) => {
  const response = await request.get(`/${STORE_ID}/overview`);

  expect(response.headers()['content-security-policy']).toContain("connect-src 'self';");
});

test('opens a demo visit from every latest failure of every route', async ({ page }) => {
  const failingRoutes = [
    'POST /orders',
    'POST /auth/sign-up',
    'POST /payouts',
    'PATCH /orders/:id',
    'POST /auth/verify-code',
  ];
  const visitLinks: string[] = [];

  for (const route of failingRoutes) {
    await page.goto(`/${STORE_ID}/requests?range=30d`);
    await page.getByRole('button', { name: `${route}, show details` }).click();
    const links = page
      .getByRole('dialog', { name: route })
      .getByRole('link', { name: /^Open visit / });
    await expect(links.first()).toBeVisible();
    for (const href of await links.evaluateAll((anchors) =>
      anchors.map((anchor) => anchor.getAttribute('href') ?? ''),
    )) {
      visitLinks.push(href);
    }
  }

  expect(visitLinks).toHaveLength(9);
  for (const href of visitLinks) {
    await page.goto(href);
    await expect(page.getByRole('heading', { name: /^Visit [0-9a-f]{8}$/ })).toBeVisible();
    await expect(page.getByText('No visits found')).toBeHidden();
  }
});

test('leads a visitor of the demo to the demo person', async ({ page }) => {
  await page.goto(`/${STORE_ID}/timeline`);

  await page.getByRole('link', { name: 'Open the timeline of the demo person u_7f3a' }).click();

  await expect(page.getByRole('heading', { name: 'User u_7f3a' })).toBeVisible();
});
