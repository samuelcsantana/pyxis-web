import { expect, test } from '@playwright/test';

const STORE_ID = '6f1d3c2a-8b4e-4f7a-9c1d-2e3f4a5b6c7d';
const EXAMPLE_FUNNEL =
  '[{"type":"page","path":"/calculator"},{"type":"event","name":"calculator_result_shown"},{"type":"page","path":"/sign-up"}]';

const SCREENS = [
  { title: 'Overview', path: 'overview' },
  { title: 'Funnel', path: `funnel?steps=${encodeURIComponent(EXAMPLE_FUNNEL)}` },
  { title: 'Features', path: 'features' },
  { title: 'Requests', path: 'requests' },
  { title: 'Timeline', path: 'timeline?user=u_7f3a' },
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
  }

  expect(outside).toEqual([]);
});

test('allows connections only to its own origin', async ({ request }) => {
  const response = await request.get(`/${STORE_ID}/overview`);

  expect(response.headers()['content-security-policy']).toContain("connect-src 'self';");
});

test('leads a visitor of the demo to the demo person', async ({ page }) => {
  await page.goto(`/${STORE_ID}/timeline`);

  await page.getByRole('link', { name: 'Open the timeline of the demo person u_7f3a' }).click();

  await expect(page.getByRole('heading', { name: 'User u_7f3a' })).toBeVisible();
});
