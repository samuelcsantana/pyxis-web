import { readFileSync } from 'node:fs';
import Ajv2020 from 'ajv/dist/2020';
import addFormats from 'ajv-formats';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { HttpAuthService } from './auth/http-auth-service';
import { demoOverviewWire } from './overview/demo-overview';
import { DEMO_ADMIN, DEMO_ME_RESPONSE } from './projects/mock-projects-service';

const CONTRACT_FILE = 'contract/openapi.json';

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

    for (const project of DEMO_ADMIN.projects) {
      const wire = demoOverviewWire(project.id, { from: '2026-09-06', to: '2026-10-05' });
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
