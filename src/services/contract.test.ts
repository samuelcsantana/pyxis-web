import { english, englishTranslator } from '@/test-utils/english';
import { readFileSync } from 'node:fs';
import {
  signedUpOf,
  signUpCodeWire,
  signUpStatusOf,
  signUpVerifyWire,
} from '@/domain/sign-up.schema';
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
import { demoMeResponse } from './projects/mock-projects-service';
import { DEMO_EMAIL_PREFERENCES_WIRE } from './preferences/mock-email-preferences-service';
import { emailPreferencesWire } from '@/domain/email-preferences';
import { newAccessTokenWire } from '@/domain/access-tokens.schema';
import {
  demoAccessTokensWire,
  demoCreatedAccessTokenWire,
} from './access-tokens/mock-access-tokens-service';
import { DEMO_DOCS, DEMO_PROJECTS, DEMO_STORE } from './demo/demo-projects';
import {
  demoConnectionDecisionWire,
  demoConnectionRequestWire,
} from './connection-requests/mock-connection-requests-service';
import {
  newProjectWire,
  projectChangesWire,
  projectDeletionWire,
} from '@/domain/project-management.schema';
import { MockProjectManagementService } from './project-management/mock-project-management-service';
import { newPersonWire } from '@/domain/project-people.schema';
import { demoPeopleWire } from './project-people/mock-project-people-service';
import { demoConnectionsWire } from './connections/mock-connections-service';
import { checkoutWire, portalWire } from '@/domain/accounts.schema';
import { demoAccountsWire } from './accounts/mock-accounts-service';
import { closeAccountWire } from '@/domain/accounts.schema';
import { DEMO_EXPORT_FILE, demoExportWire } from './exports/mock-exports-service';
import { LIVE_DEMO_URL } from '@/lib/site';

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

const SIGNED_IN_ANSWER = { email: 'owner@example.com', session_token: 'T'.repeat(43) };

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

const NO_SESSION_KEEPER = {
  keep: () => Promise.resolve(),
  end: () => Promise.resolve(),
  endAll: () => Promise.resolve(),
};

describe('the API contract copied from pyxis-api', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('accepts the demo answer of /v1/me, so demo mode shows what the API sends', () => {
    const validate = contractSchema('Me');

    expect(validate(demoMeResponse(english.t, NOW)), JSON.stringify(validate.errors)).toBe(true);
  });

  it('accepts the demo settings of each demo project', () => {
    const validate = contractSchema('ProjectSettings');

    for (const project of DEMO_PROJECTS) {
      const settings = demoProjectSettingsWire(project.id, NOW, 'My site');
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

  it('accepts the demo access tokens, the body that creates one and the token it answers', () => {
    const list = contractSchema('AccessTokens');
    const create = contractSchema('CreateAccessToken');
    const created = contractSchema('CreatedAccessToken');
    const request = { name: ' Claude Code ', lifetimeDays: 365 } as const;

    expect(list(demoAccessTokensWire(NOW)), JSON.stringify(list.errors)).toBe(true);
    expect(create(newAccessTokenWire(request)), JSON.stringify(create.errors)).toBe(true);
    expect(created(demoCreatedAccessTokenWire(request, NOW)), JSON.stringify(created.errors)).toBe(
      true,
    );
  });

  it('accepts the demo connection request and where each answer sends the browser', () => {
    const request = contractSchema('AuthorizationRequest');
    const decision = contractSchema('AuthorizationDecision');

    expect(request(demoConnectionRequestWire(NOW, english.t)), JSON.stringify(request.errors)).toBe(
      true,
    );
    for (const answer of ['approve', 'deny'] as const) {
      expect(decision(demoConnectionDecisionWire(answer)), JSON.stringify(decision.errors)).toBe(
        true,
      );
    }
  });

  it('accepts the changes, keys and deletions the owner sends, and the keys the demo creates', async () => {
    const changes = contractSchema('ProjectChanges');
    const deletion = contractSchema('ProjectDeletion');
    const newKey = contractSchema('NewProjectKey');
    const createdKey = contractSchema('CreatedProjectKey');
    const service = new MockProjectManagementService(englishTranslator);
    const body = projectChangesWire({
      name: 'Shop',
      allowedOrigins: ['https://shop.example.com'],
      timezone: 'America/Sao_Paulo',
      conversionEvent: null,
    });

    expect(changes(body), JSON.stringify(changes.errors)).toBe(true);
    expect(deletion(projectDeletionWire('Shop')), JSON.stringify(deletion.errors)).toBe(true);
    const newProject = contractSchema('NewProject');
    for (const conversionEvent of [null, 'signup_completed']) {
      const created = newProjectWire({
        name: 'Shop',
        allowedOrigins: ['https://shop.example.com'],
        timezone: 'America/Sao_Paulo',
        conversionEvent,
      });
      expect(newProject(created), JSON.stringify(newProject.errors)).toBe(true);
    }
    for (const kind of ['public', 'secret'] as const) {
      const outcome = await service.createKey(DEMO_STORE.id, kind);
      expect(newKey({ kind }), JSON.stringify(newKey.errors)).toBe(true);
      expect(outcome.kind === 'created' && createdKey(outcome.key)).toBe(true);
    }
  });

  it('accepts the people the demo lists and the address the owner adds', () => {
    const people = contractSchema('ProjectPeople');
    const newPerson = contractSchema('NewProjectPerson');

    expect(people(demoPeopleWire()), JSON.stringify(people.errors)).toBe(true);
    expect(
      newPerson(newPersonWire(' ana@example.com ', 'pt-BR')),
      JSON.stringify(newPerson.errors),
    ).toBe(true);
  });

  it('accepts the demo connected apps and the address to connect another', () => {
    const connections = contractSchema('Connections');

    expect(connections(demoConnectionsWire(NOW)), JSON.stringify(connections.errors)).toBe(true);
  });

  it('accepts the demo accounts and the Checkout and portal requests', () => {
    const accounts = contractSchema('MyAccounts');
    const checkout = contractSchema('CheckoutRequest');
    const portal = contractSchema('PortalRequest');

    expect(accounts(demoAccountsWire(NOW)), JSON.stringify(accounts.errors)).toBe(true);
    expect(checkout(checkoutWire('year', 'pt-BR')), JSON.stringify(checkout.errors)).toBe(true);
    expect(portal(portalWire('es')), JSON.stringify(portal.errors)).toBe(true);
  });

  it('accepts the demo exports and the closure the owner confirms', () => {
    const projectExport = contractSchema('ProjectExport');
    const closure = contractSchema('CloseAccountRequest');

    const pending = demoExportWire(NOW, 'pending');
    const done = demoExportWire(NOW, 'done');
    const servedByTheDemo = {
      ...done,
      download_url: new URL(DEMO_EXPORT_FILE, LIVE_DEMO_URL).href,
    };

    expect(projectExport(pending), JSON.stringify(projectExport.errors)).toBe(true);
    expect(projectExport(servedByTheDemo), JSON.stringify(projectExport.errors)).toBe(true);
    expect(closure(closeAccountWire(' owner@example.com ')), JSON.stringify(closure.errors)).toBe(
      true,
    );
  });

  it('documents the sign-up answers the dashboard reads', () => {
    const status = contractSchema('SignUpStatus');
    const signedUp = contractSchema('SignedUp');
    const openToFreeOwners = {
      open: true,
      terms_version: '1.3',
      terms_url: 'https://pyxis.example.com/termos',
      free_plan: 'open',
    };
    const startedFree = {
      email: 'ana@example.com',
      session_token: 'T'.repeat(43),
      account_id: '7d3f9b1e-5a2c-4e8d-9f6b-1c4a7e2d8b5f',
      account_status: 'free',
      free_place: 'placed',
    };
    const refusedForTheMailbox = {
      ...startedFree,
      email: 'ana+shop@example.com',
      account_status: 'incomplete',
      free_place: 'taken_by_same_mailbox',
    };

    expect(status(openToFreeOwners), JSON.stringify(status.errors)).toBe(true);
    expect(signUpStatusOf(openToFreeOwners).freePlan).toBe('open');
    expect(signedUp(startedFree), JSON.stringify(signedUp.errors)).toBe(true);
    expect(signedUpOf(startedFree)).toMatchObject({ accountStatus: 'free', freePlace: 'placed' });
    expect(signedUp(refusedForTheMailbox), JSON.stringify(signedUp.errors)).toBe(true);
    expect(signedUpOf(refusedForTheMailbox).freePlace).toBe('taken_by_same_mailbox');
  });

  it('accepts the bodies the sign-up form sends', () => {
    const code = contractSchema('SignUpCodeRequest');
    const verify = contractSchema('SignUpRequest');

    expect(code(signUpCodeWire(' ana@example.com ', 'pt-BR')), JSON.stringify(code.errors)).toBe(
      true,
    );
    expect(
      verify(signUpVerifyWire('ana@example.com', '123456', '2026-11-01')),
      JSON.stringify(verify.errors),
    ).toBe(true);
  });

  it('accepts the bodies the sign-in form sends, and the answer it keeps a token from', async () => {
    const bodies = sentBodies();
    const service = new HttpAuthService('https://api.pyxis.example.com', NO_SESSION_KEEPER);

    await service.requestCode('owner@example.com', 'pt-BR');
    await service.verifyCode('owner@example.com', '123456');
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
