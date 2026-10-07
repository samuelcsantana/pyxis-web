import { OTHER_VALUE } from '@/domain/devices';
import { type DemoProject, evenShares } from './demo-catalog';
import { DEMO_STORE_PERSON, DEMO_STORE_VISITS } from './demo-store-visits';

const MONTHS_IN_A_YEAR = 12;

const REPORT_PERIODS = Array.from(
  { length: MONTHS_IN_A_YEAR },
  (_, index) => [`2026-${String(index + 1).padStart(2, '0')}`, 1 / MONTHS_IN_A_YEAR] as const,
);

function signInMethods(emailCode: number, google: number, password: number) {
  return [
    ['email_code', emailCode],
    ['google', google],
    ['password', password],
  ] as const;
}

export const DEMO_STORE: DemoProject = {
  id: '6f1d3c2a-8b4e-4f7a-9c1d-2e3f4a5b6c7d',
  name: 'Demo Store',
  timezone: 'America/Sao_Paulo',
  conversionEvent: 'signup_completed',
  visitsPerPageView: 0.32,
  identifiedShare: 0.09,
  pages: [
    { path: '/dashboard', perDay: 71, visitsPerView: 0.19 },
    { path: '/', perDay: 50, visitsPerView: 0.9 },
    { path: '/orders', perDay: 44, visitsPerView: 0.24 },
    { path: '/calculator', perDay: 37, visitsPerView: 0.85 },
    { path: '/pricing', perDay: 25, visitsPerView: 0.82 },
    { path: '/products', perDay: 20, visitsPerView: 0.31 },
    { path: '/sign-up', perDay: 16, visitsPerView: 0.8 },
    { path: '/orders/:id', perDay: 13, visitsPerView: 0.31 },
    { path: '/reports', perDay: 10, visitsPerView: 0.33 },
    { path: '/blog/:slug', perDay: 9, visitsPerView: 0.9 },
    { path: '/orders/new', perDay: 7, visitsPerView: 0.6 },
    { path: '/settings', perDay: 6, visitsPerView: 0.81 },
    { path: '/payouts', perDay: 4, visitsPerView: 0.7 },
  ],
  events: [
    {
      name: 'calculator_result_shown',
      perDay: 30,
      visitsPerCount: 0.75,
      properties: [
        {
          key: 'calculator',
          carriedShare: 1,
          values: [
            ['shipping', 0.62],
            ['margin', 0.38],
          ],
        },
        {
          key: 'used_plan_preset',
          carriedShare: 1,
          values: [
            ['false', 0.59],
            ['true', 0.41],
          ],
        },
      ],
    },
    {
      name: 'cta_clicked',
      perDay: 29,
      visitsPerCount: 0.81,
      properties: [
        {
          key: 'cta',
          carriedShare: 1,
          values: [
            ['start_trial', 0.62],
            ['see_plans', 0.2],
            ['create_account', 0.12],
            ['view_demo', 0.06],
          ],
        },
        {
          key: 'location',
          carriedShare: 1,
          values: [
            ['calculator_result', 0.45],
            ['hero', 0.3],
            ['pricing', 0.15],
            ['nav', 0.06],
            ['final_cta', 0.04],
          ],
        },
      ],
    },
    {
      name: 'order_created',
      perDay: 26,
      visitsPerCount: 0.35,
      properties: [{ key: 'first', carriedShare: 0.14, values: [['true', 1]] }],
    },
    {
      name: 'login_completed',
      perDay: 13,
      visitsPerCount: 0.66,
      properties: [{ key: 'method', carriedShare: 1, values: signInMethods(0.55, 0.3, 0.15) }],
    },
    {
      name: 'signup_submitted',
      perDay: 9,
      visitsPerCount: 0.94,
      properties: [{ key: 'method', carriedShare: 1, values: signInMethods(0.6, 0.28, 0.12) }],
    },
    {
      name: 'signup_completed',
      perDay: 4.5,
      visitsPerCount: 1,
      properties: [{ key: 'method', carriedShare: 1, values: signInMethods(0.58, 0.3, 0.12) }],
    },
    { name: 'product_created', perDay: 4, visitsPerCount: 0.46, properties: [] },
    {
      name: 'report_exported',
      perDay: 2,
      visitsPerCount: 0.47,
      properties: [
        {
          key: 'format',
          carriedShare: 1,
          values: [
            ['pdf', 0.6],
            ['csv', 0.4],
          ],
        },
        { key: 'period', carriedShare: 1, values: REPORT_PERIODS },
      ],
    },
  ],
  routes: [
    {
      method: 'POST',
      route: '/orders',
      perDay: 26,
      successStatus: 201,
      failures: [
        [409, 0.011],
        [400, 0.006],
      ],
      medianDurationMs: 164,
      screens: [
        ['/orders', 0.875],
        ['/orders/new', 0.125],
      ],
    },
    {
      method: 'PATCH',
      route: '/orders/:id',
      perDay: 14,
      successStatus: 200,
      failures: [[400, 0.01]],
      medianDurationMs: 141,
      screens: [['/orders/:id', 1]],
    },
    {
      method: 'POST',
      route: '/auth/verify-code',
      perDay: 10,
      successStatus: 200,
      failures: [[400, 0.014]],
      medianDurationMs: 198,
      screens: [
        ['/sign-up', 0.4],
        ['/', 0.6],
      ],
    },
    {
      method: 'POST',
      route: '/auth/sign-up',
      perDay: 9,
      successStatus: 201,
      failures: [
        [400, 0.02],
        [429, 0.012],
      ],
      medianDurationMs: 233,
      screens: [['/sign-up', 1]],
    },
    {
      method: 'POST',
      route: '/products',
      perDay: 4,
      successStatus: 201,
      failures: [],
      medianDurationMs: 168,
      screens: [['/products', 1]],
    },
    {
      method: 'PATCH',
      route: '/users/me',
      perDay: 3,
      successStatus: 200,
      failures: [],
      medianDurationMs: 120,
      screens: [['/settings', 1]],
    },
    {
      method: 'POST',
      route: '/payouts',
      perDay: 2,
      successStatus: 201,
      failures: [
        [422, 0.07],
        [500, 0.04],
        [0, 0.03],
      ],
      medianDurationMs: 412,
      screens: [['/payouts', 1]],
    },
    {
      method: 'DELETE',
      route: '/orders/:id',
      perDay: 2,
      successStatus: 204,
      failures: [],
      medianDurationMs: 97,
      screens: [['/orders/:id', 1]],
    },
  ],
  failedReads: [
    {
      route: '/orders/:id',
      perDay: 1.4,
      statuses: [
        [404, 0.75],
        [500, 0.15],
        [0, 0.1],
      ],
      medianDurationMs: 310,
      screens: [['/orders/:id', 1]],
    },
    {
      route: '/products',
      perDay: 0.6,
      statuses: [
        [503, 0.7],
        [0, 0.3],
      ],
      medianDurationMs: 2400,
      screens: [
        ['/products', 0.65],
        ['/orders/new', 0.35],
      ],
    },
  ],
  deviceTypes: [
    { value: 'mobile', share: 0.62, conversionWeight: 0.82 },
    { value: 'desktop', share: 0.34, conversionWeight: 1.31 },
    { value: 'tablet', share: 0.04, conversionWeight: 0.93 },
  ],
  browsers: evenShares([
    ['chrome', 0.48],
    ['safari', 0.31],
    ['samsung', 0.11],
    ['firefox', 0.05],
    ['edge', 0.03],
    [OTHER_VALUE, 0.02],
  ]),
  operatingSystems: evenShares([
    ['android', 0.44],
    ['ios', 0.29],
    ['windows', 0.18],
    ['macos', 0.07],
    ['linux', 0.01],
    [OTHER_VALUE, 0.01],
  ]),
  countries: evenShares([
    ['BR', 0.862],
    ['PT', 0.056],
    ['US', 0.036],
    ['AR', 0.017],
    [OTHER_VALUE, 0.029],
  ]),
  channels: {
    paid: 0.35,
    email: 0,
    social: 0.11,
    campaign: 0,
    organic: 0.31,
    referral: 0.07,
    direct: 0.16,
  },
  sources: [
    {
      source: 'google',
      medium: 'cpc',
      channel: 'paid',
      share: 0.8,
      conversionWeight: 1.02,
      adClickShare: 0.94,
    },
    {
      source: 'bing',
      medium: 'cpc',
      channel: 'paid',
      share: 0.2,
      conversionWeight: 0.69,
      adClickShare: 0.81,
    },
    {
      source: 'www.google.com',
      medium: null,
      channel: 'organic',
      share: 0.9,
      conversionWeight: 1.22,
      adClickShare: 0,
    },
    {
      source: 'duckduckgo.com',
      medium: null,
      channel: 'organic',
      share: 0.1,
      conversionWeight: 1.09,
      adClickShare: 0,
    },
    {
      source: '(direct)',
      medium: null,
      channel: 'direct',
      share: 1,
      conversionWeight: 1.4,
      adClickShare: 0,
    },
    {
      source: 'l.instagram.com',
      medium: null,
      channel: 'social',
      share: 0.7,
      conversionWeight: 0.76,
      adClickShare: 0,
    },
    {
      source: 't.co',
      medium: null,
      channel: 'social',
      share: 0.3,
      conversionWeight: 0.47,
      adClickShare: 0,
    },
    {
      source: 'blog.example.com',
      medium: null,
      channel: 'referral',
      share: 1,
      conversionWeight: 0.84,
      adClickShare: 0,
    },
  ],
  exampleFunnel: [
    { type: 'page', path: '/calculator' },
    { type: 'event', name: 'calculator_result_shown' },
    { type: 'page', path: '/sign-up' },
    { type: 'event', name: 'signup_submitted' },
    { type: 'event', name: 'signup_completed' },
    { type: 'event', name: 'order_created' },
  ],
  funnelContinuation: [0.625, 0.411, 0.538, 0.791, 0.458, 0.7, 0.6],
  person: DEMO_STORE_PERSON,
  visits: DEMO_STORE_VISITS,
};
