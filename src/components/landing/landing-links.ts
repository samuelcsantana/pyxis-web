import { DASHBOARD_URL, LIVE_DEMO_URL } from '@/lib/site';

const GITHUB_PROFILE = 'https://github.com/samuelcsantana';

export const CONTACT_EMAIL = 'hello@pyxis-analytics.dev';

export const LANDING_LINKS = {
  demo: LIVE_DEMO_URL,
  signIn: `${DASHBOARD_URL}/sign-in`,
  signUp: `${DASHBOARD_URL}/sign-up`,
  api: `${GITHUB_PROFILE}/pyxis-api`,
  selfHost: `${GITHUB_PROFILE}/pyxis-api/blob/main/docs/RUNBOOK.md#first-time-setup`,
  sdk: `${GITHUB_PROFILE}/pyxis-sdk`,
  web: `${GITHUB_PROFILE}/pyxis-web`,
  npm: 'https://www.npmjs.com/package/pyxis-analytics',
  sdkPackage: `${GITHUB_PROFILE}/pyxis-sdk/blob/main/package.json`,
  coverage: 'https://app.codecov.io/gh/samuelcsantana',
  license: `${GITHUB_PROFILE}/pyxis-api/blob/main/LICENSE`,
  storybook: 'https://samuelcsantana.github.io/pyxis-web/',
  apiReference: 'https://samuelcsantana.github.io/pyxis-api/',
  playground: 'https://samuelcsantana.github.io/pyxis-sdk/',
  author: 'https://www.samuelsantana.dev',
  bolsoverde: 'https://bolsoverde.com',
} as const;

export const PROPER_NAMES = {
  gitHub: 'GitHub',
  storybook: 'Storybook',
  npm: 'npm',
  api: 'pyxis-api',
  sdk: 'pyxis-sdk',
  web: 'pyxis-web',
  author: 'samuelsantana.dev',
  bolsoverde: 'bolsoverde.com',
} as const;
