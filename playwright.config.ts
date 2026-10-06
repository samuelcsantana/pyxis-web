import { defineConfig, devices } from '@playwright/test';

const PORT = 3101;
const BASE_URL = `http://localhost:${String(PORT)}`;
const isCi = process.env.CI !== undefined;

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: isCi,
  retries: isCi ? 1 : 0,
  reporter: isCi ? [['list'], ['html', { open: 'never' }]] : 'list',
  use: {
    baseURL: BASE_URL,
    trace: 'on-first-retry',
    locale: 'en-US',
  },
  projects: [
    {
      name: 'desktop',
      use: { ...devices['Desktop Chrome'], viewport: { width: 1440, height: 900 } },
    },
    {
      name: 'mobile',
      use: { ...devices['Pixel 7'], viewport: { width: 390, height: 844 } },
    },
  ],
  webServer: {
    command: `npm run build && npm run start -- -p ${String(PORT)}`,
    url: BASE_URL,
    reuseExistingServer: false,
    timeout: 180_000,
    env: { NEXT_PUBLIC_PYXIS_API_URL: '', NEXT_TELEMETRY_DISABLED: '1' },
  },
});
