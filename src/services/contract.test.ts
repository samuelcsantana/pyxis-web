import { readFileSync } from 'node:fs';
import Ajv2020 from 'ajv/dist/2020';
import addFormats from 'ajv-formats';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { NO_VISIT_FILTERS } from '@/domain/visits';
import { HttpAuthService } from './auth/http-auth-service';
import { demoAcquisitionWire } from './acquisition/demo-acquisition';
import { demoDevicesWire } from './devices/demo-devices';
import { demoFeaturesWire } from './features/demo-features';
import { demoPropertyBreakdownWire } from './features/demo-properties';
import { demoFunnelWire } from './funnel/demo-funnel';
import { demoRequestsWire } from './requests/demo-requests';
import { DEMO_USER_ID, demoTimelineWire } from './timeline/demo-timeline';
import { demoVisitsWire } from './visits/demo-visit-list';
import { demoOverviewWire } from './overview/demo-overview';
import { DEMO_ME_RESPONSE } from './projects/mock-projects-service';
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

function sentBodies() {
  const fetchMock = vi.fn<typeof fetch>(() => Promise.resolve(new Response(null, { status: 200 })));
  vi.stubGlobal('fetch', fetchMock);
  return () =>
    fetchMock.mock.calls.map(([, init]) =>
      typeof init?.body === 'string' ? (JSON.parse(init.body) as unknown) : undefined,
    );
}

describe('the API contract copied from pyxis-api', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('accepts the demo answer of /v1/me, so demo mode shows what the API sends', () => {
    const validate = contractSchema('Me');

    expect(validate(DEMO_ME_RESPONSE), JSON.stringify(validate.errors)).toBe(true);
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

  it('accepts the demo devices of each demo project', () => {
    const validate = contractSchema('DevicesReport');

    for (const project of DEMO_PROJECTS) {
      const wire = demoDevicesWire(project.id, RANGE);
      expect(validate(wire), JSON.stringify(validate.errors)).toBe(true);
    }
  });

  it('accepts the demo acquisition of each demo project', () => {
    const validate = contractSchema('AcquisitionReport');

    for (const project of DEMO_PROJECTS) {
      const wire = demoAcquisitionWire(project.id, RANGE);
      expect(validate(wire), JSON.stringify(validate.errors)).toBe(true);
    }
  });

  it('accepts the demo features of each kind, for each demo project', () => {
    const validate = contractSchema('FeaturesReport');

    for (const project of DEMO_PROJECTS) {
      for (const kind of ['events', 'screens'] as const) {
        const wire = demoFeaturesWire(project.id, RANGE, kind);
        expect(validate(wire), JSON.stringify(validate.errors)).toBe(true);
      }
    }
  });

  it('accepts the demo property breakdown of every demo event and of an unknown one', () => {
    const validate = contractSchema('PropertyBreakdownReport');

    for (const project of DEMO_PROJECTS) {
      const names = [...project.events.map((event) => event.name), 'never_sent'];
      for (const name of names) {
        const wire = demoPropertyBreakdownWire(project.id, RANGE, name);
        expect(validate(wire), JSON.stringify(validate.errors)).toBe(true);
      }
    }
  });

  it('accepts the demo requests, with and without a screen filter', () => {
    const validate = contractSchema('RequestsReport');

    for (const project of DEMO_PROJECTS) {
      for (const screen of [null, '/orders', '/docs/:slug']) {
        const wire = demoRequestsWire(project.id, RANGE, screen, NOW);
        expect(validate(wire), JSON.stringify(validate.errors)).toBe(true);
      }
    }
  });

  it('accepts the demo funnel of each demo project in both modes', () => {
    const validate = contractSchema('FunnelReport');

    for (const project of DEMO_PROJECTS) {
      for (const mode of ['visit', 'user'] as const) {
        const wire = demoFunnelWire(project.id, RANGE, mode, project.exampleFunnel);
        expect(validate(wire), JSON.stringify(validate.errors)).toBe(true);
      }
    }
  });

  it('accepts the demo timeline of every demo visit', () => {
    const validate = contractSchema('TimelineReport');

    for (const project of DEMO_PROJECTS) {
      for (const visit of project.visits) {
        const wire = demoTimelineWire(project.id, { kind: 'visit', id: visit.sessionId }, NOW);
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

  it('accepts the bodies the sign-in form sends', async () => {
    const bodies = sentBodies();
    const service = new HttpAuthService('https://api.pyxis.example.com');

    await service.requestCode('owner@demo-store.example');
    await service.verifyCode('owner@demo-store.example', '123456');
    const [requestCode, verifyCode] = bodies();

    expect(contractSchema('RequestCodeRequest')(requestCode)).toBe(true);
    expect(contractSchema('VerifyCodeRequest')(verifyCode)).toBe(true);
  });

  it('would catch a body that drifted from the contract', () => {
    expect(contractSchema('VerifyCodeRequest')({ email: 'a@example.com', code: '12a456' })).toBe(
      false,
    );
  });
});
