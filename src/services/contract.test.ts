import { readFileSync } from 'node:fs';
import Ajv2020 from 'ajv/dist/2020';
import addFormats from 'ajv-formats';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { NO_VISIT_FILTERS } from '@/domain/visits';
import { HttpAuthService } from './auth/http-auth-service';
import { demoAcquisitionWire } from './acquisition/demo-acquisition';
import { demoDevicesWire } from './devices/demo-devices';
import { demoEngagementWire } from './features/demo-engagement';
import { demoFeaturesWire } from './features/demo-features';
import { demoPropertyBreakdownWire } from './features/demo-properties';
import {
  demoFunnelSegmentsWire,
  demoFunnelSubjectsWire,
  demoFunnelWire,
} from './funnel/demo-funnel';
import {
  demoFailedReadsWire,
  demoRequestsWire,
  demoRouteRequestsWire,
} from './requests/demo-requests';
import { DEMO_USER_ID, demoTimelineWire } from './timeline/demo-timeline';
import { demoVisitsWire } from './visits/demo-visit-list';
import { demoOverviewWire } from './overview/demo-overview';
import { demoProjectSettingsWire } from './projects/demo-project-settings';
import { demoTimeOfDayWire } from './overview/demo-time-of-day';
import { DEMO_ME_RESPONSE } from './projects/mock-projects-service';
import { DEMO_EMAIL_PREFERENCES_WIRE } from './preferences/mock-email-preferences-service';
import { emailPreferencesWire } from '@/domain/email-preferences';
import { DEMO_DOCS, DEMO_PROJECTS, DEMO_STORE } from './demo/demo-projects';

const CONTRACT_FILE = 'contract/openapi.json';
const RANGE = { from: '2026-09-06', to: '2026-10-05' };
const NOW = new Date('2026-10-06T02:30:00.000Z');
const DURING_THE_LAST_DAY = new Date('2026-10-05T13:03:00.000Z');

function contractSchema(name: string) {
  const ajv = new Ajv2020({ strict: false, allErrors: true });
  addFormats(ajv);
  ajv.addSchema(JSON.parse(readFileSync(CONTRACT_FILE, 'utf8')) as object, 'openapi.json');
  const validate = ajv.getSchema(`openapi.json#/components/schemas/${name}`);
  if (validate === undefined) {
    throw new Error(`The contract has no named ${name} schema.`);
  }
  return validate;
}

const SIGNED_IN_ANSWER = { email: 'owner@demo-store.example', session_token: 'T'.repeat(43) };

function sentBodies() {
  const fetchMock = vi.fn<typeof fetch>(() =>
    Promise.resolve(
      new Response(JSON.stringify(SIGNED_IN_ANSWER), {
        status: 200,
        headers: { 'content-type': 'application/json' },
      }),
    ),
  );
  vi.stubGlobal('fetch', fetchMock);
  return () =>
    fetchMock.mock.calls.map(([, init]) =>
      typeof init?.body === 'string' ? (JSON.parse(init.body) as unknown) : undefined,
    );
}

const NO_SESSION_KEEPER = { keep: () => Promise.resolve(), end: () => Promise.resolve() };

describe('the API contract copied from pyxis-api', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('accepts the demo answer of /v1/me, so demo mode shows what the API sends', () => {
    const validate = contractSchema('Me');

    expect(validate(DEMO_ME_RESPONSE), JSON.stringify(validate.errors)).toBe(true);
  });

  it('accepts the demo settings of each demo project', () => {
    const validate = contractSchema('ProjectSettings');

    for (const project of DEMO_PROJECTS) {
      const settings = demoProjectSettingsWire(project.id, NOW);
      expect(validate(settings), JSON.stringify(validate.errors)).toBe(true);
    }
  });

  it('accepts the demo overview of each demo project', () => {
    const validate = contractSchema('OverviewReport');

    for (const project of DEMO_PROJECTS) {
      for (const now of [NOW, DURING_THE_LAST_DAY]) {
        const wire = demoOverviewWire(project.id, RANGE, now);
        expect(validate(wire), JSON.stringify(validate.errors)).toBe(true);
      }
    }
  });

  it('accepts the demo time of day of each demo project', () => {
    const validate = contractSchema('TimeOfDayReport');

    for (const project of DEMO_PROJECTS) {
      const report = demoTimeOfDayWire(project.id, RANGE, NOW);
      expect(validate(report), JSON.stringify(validate.errors)).toBe(true);
    }
  });

  it('accepts the demo engagement of each demo project', () => {
    const validate = contractSchema('EngagementReport');

    for (const project of DEMO_PROJECTS) {
      const report = demoEngagementWire(project.id, RANGE, NOW);
      expect(validate(report), JSON.stringify(validate.errors)).toBe(true);
    }
  });

  it('accepts the demo funnel segments by device and by channel', () => {
    const validate = contractSchema('FunnelSegmentsReport');

    for (const by of ['device', 'channel'] as const) {
      const report = demoFunnelSegmentsWire(
        DEMO_STORE.id,
        RANGE,
        DEMO_STORE.exampleFunnel,
        by,
        NOW,
      );
      expect(validate(report), JSON.stringify(validate.errors)).toBe(true);
    }
  });

  it('accepts the demo devices of each demo project', () => {
    const validate = contractSchema('DevicesReport');

    for (const project of DEMO_PROJECTS) {
      const wire = demoDevicesWire(project.id, RANGE, NOW);
      expect(validate(wire), JSON.stringify(validate.errors)).toBe(true);
    }
  });

  it('accepts the demo acquisition of each demo project', () => {
    const validate = contractSchema('AcquisitionReport');

    for (const project of DEMO_PROJECTS) {
      const wire = demoAcquisitionWire(project.id, RANGE, NOW);
      expect(validate(wire), JSON.stringify(validate.errors)).toBe(true);
    }
  });

  it('accepts the demo features of each kind, for each demo project', () => {
    const validate = contractSchema('FeaturesReport');

    for (const project of DEMO_PROJECTS) {
      for (const kind of ['events', 'screens'] as const) {
        const wire = demoFeaturesWire(project.id, RANGE, kind, NOW);
        expect(validate(wire), JSON.stringify(validate.errors)).toBe(true);
      }
    }
  });

  it('accepts the demo property breakdown of every demo event and of an unknown one', () => {
    const validate = contractSchema('PropertyBreakdownReport');

    for (const project of DEMO_PROJECTS) {
      const names = [...project.events.map((event) => event.name), 'never_sent'];
      for (const name of names) {
        const wire = demoPropertyBreakdownWire(project.id, RANGE, name, NOW);
        expect(validate(wire), JSON.stringify(validate.errors)).toBe(true);
      }
    }
  });

  it('accepts the demo requests, with and without a screen filter', () => {
    const validate = contractSchema('RequestsReport');

    for (const project of DEMO_PROJECTS) {
      for (const screen of [null, '/orders', '/docs/:slug']) {
        const wire = demoRequestsWire(project.id, RANGE, screen, NOW, null);
        expect(validate(wire), JSON.stringify(validate.errors)).toBe(true);
      }
    }
  });

  it('accepts the demo failed reads, with and without a screen filter', () => {
    const validate = contractSchema('RequestsReport');

    for (const project of DEMO_PROJECTS) {
      for (const screen of [null, '/products', '/search']) {
        const wire = demoFailedReadsWire(project.id, RANGE, screen, NOW, null);
        expect(validate(wire), JSON.stringify(validate.errors)).toBe(true);
      }
    }
  });

  it('accepts the demo days of one route, written or read, with and without a screen', () => {
    const validate = contractSchema('RequestsReport');

    for (const [kind, screen, route] of [
      ['writes', null, 'POST /orders'],
      ['writes', '/orders', 'POST /orders'],
      ['reads', null, 'GET /products'],
      ['reads', '/search', 'GET /search'],
    ] as const) {
      const wire = demoRouteRequestsWire(DEMO_STORE.id, RANGE, kind, screen, route, NOW);
      expect(wire.route_days?.length).toBe(30);
      expect(validate(wire), JSON.stringify(validate.errors)).toBe(true);
    }
  });

  it('accepts the demo funnel of each demo project in both modes', () => {
    const validate = contractSchema('FunnelReport');

    for (const project of DEMO_PROJECTS) {
      for (const mode of ['visit', 'user'] as const) {
        const wire = demoFunnelWire(project.id, RANGE, mode, project.exampleFunnel, NOW);
        expect(validate(wire), JSON.stringify(validate.errors)).toBe(true);
      }
    }
  });

  it('accepts the demo lists of who reached or left a step, on the first and an older page', () => {
    const validate = contractSchema('FunnelSubjectsReport');

    for (const mode of ['visit', 'user'] as const) {
      const first = demoFunnelSubjectsWire(
        DEMO_STORE.id,
        RANGE,
        mode,
        DEMO_STORE.exampleFunnel,
        { step: 2, outcome: 'dropped', cursor: null },
        NOW,
      );
      const older = demoFunnelSubjectsWire(
        DEMO_STORE.id,
        RANGE,
        mode,
        DEMO_STORE.exampleFunnel,
        { step: 2, outcome: 'dropped', cursor: first.next_cursor },
        NOW,
      );
      expect(validate(first), JSON.stringify(validate.errors)).toBe(true);
      expect(validate(older), JSON.stringify(validate.errors)).toBe(true);
    }
  });

  it('accepts the demo timeline of every demo visit', () => {
    const validate = contractSchema('TimelineReport');

    for (const project of DEMO_PROJECTS) {
      const listed = demoVisitsWire(project.id, RANGE, NO_VISIT_FILTERS, null, NOW).visits;
      const sessions = [
        ...project.showcase.map((visit) => visit.sessionId),
        ...listed.map((visit) => visit.session_id),
      ];
      for (const sessionId of sessions) {
        const wire = demoTimelineWire(project.id, { kind: 'visit', id: sessionId }, NOW);
        expect(validate(wire), JSON.stringify(validate.errors)).toBe(true);
      }
    }
    const person = demoTimelineWire(DEMO_STORE.id, { kind: 'user', id: DEMO_USER_ID }, NOW);
    expect(validate(person), JSON.stringify(validate.errors)).toBe(true);
  });

  it('accepts the demo visits, filtered or not, on every page', () => {
    const validate = contractSchema('VisitsReport');
    const first = demoVisitsWire(DEMO_STORE.id, RANGE, NO_VISIT_FILTERS, null, NOW);
    const filtered = { ...NO_VISIT_FILTERS, paths: ['/orders*'], identity: 'identified' as const };

    for (const wire of [
      first,
      demoVisitsWire(DEMO_STORE.id, RANGE, NO_VISIT_FILTERS, first.next_cursor, NOW),
      demoVisitsWire(DEMO_STORE.id, RANGE, filtered, null, NOW),
      demoVisitsWire(DEMO_DOCS.id, RANGE, NO_VISIT_FILTERS, null, NOW),
    ]) {
      expect(wire.visits.length).toBeGreaterThan(0);
      expect(validate(wire), JSON.stringify(validate.errors)).toBe(true);
    }
  });

  it('accepts the bodies the sign-in form sends, and the answer it keeps a token from', async () => {
    const bodies = sentBodies();
    const service = new HttpAuthService('https://api.pyxis.example.com', NO_SESSION_KEEPER);

    await service.requestCode('owner@demo-store.example', 'pt-BR');
    await service.verifyCode('owner@demo-store.example', '123456');
    const [requestCode, verifyCode] = bodies();

    expect(contractSchema('RequestCodeRequest')(requestCode)).toBe(true);
    expect(contractSchema('VerifyCodeRequest')(verifyCode)).toBe(true);
    expect(contractSchema('SignedIn')(SIGNED_IN_ANSWER)).toBe(true);
  });

  it('accepts the demo e-mail preferences and the body the Settings switch sends', () => {
    const validate = contractSchema('EmailPreferences');

    expect(validate(DEMO_EMAIL_PREFERENCES_WIRE), JSON.stringify(validate.errors)).toBe(true);
    expect(validate(emailPreferencesWire({ weeklyDigest: false }))).toBe(true);
    expect(validate({ weekly_digest: 'yes' })).toBe(false);
  });

  it('would catch a body that drifted from the contract', () => {
    expect(contractSchema('VerifyCodeRequest')({ email: 'a@example.com', code: '12a456' })).toBe(
      false,
    );
  });
});
