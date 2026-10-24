import { describe, expect, it } from 'vitest';
import type { ArrivalsReport } from '@/domain/arrivals';
import { arrivalsReportOf, readArrivalsAnswer } from './arrivals-answer';

const REPORT: ArrivalsReport = {
  asOf: 1_000,
  activeVisits: 2,
  visits: { times: [900], more: false },
  conversions: null,
  namedEvents: { times: [], more: true },
  failedRequests: { times: [800], more: false },
};

describe('arrivalsReportOf', () => {
  it('reads a report, with or without conversions', () => {
    expect(arrivalsReportOf(REPORT)).toEqual(REPORT);
    expect(
      arrivalsReportOf({ ...REPORT, conversions: { times: [950], more: false } })?.conversions,
    ).toEqual({ times: [950], more: false });
  });

  it.each([
    ['nothing', null],
    ['text', 'report'],
    ['no moment', { ...REPORT, asOf: 'now' }],
    ['no active visits', { ...REPORT, activeVisits: undefined }],
    ['visits without a list', { ...REPORT, visits: { more: false } }],
    ['visits without more', { ...REPORT, visits: { times: [] } }],
    ['a time that is not a number', { ...REPORT, namedEvents: { times: ['x'], more: false } }],
    ['malformed conversions', { ...REPORT, conversions: 'none' }],
    ['malformed failed requests', { ...REPORT, failedRequests: null }],
  ])('refuses %s', (_, value) => {
    expect(arrivalsReportOf(value)).toBeUndefined();
  });
});

describe('readArrivalsAnswer', () => {
  it('reads the report of a successful answer', async () => {
    expect(await readArrivalsAnswer(Response.json(REPORT))).toEqual({
      kind: 'report',
      report: REPORT,
    });
  });

  it('takes an expired session or a redirect to the sign-in page as signed out', async () => {
    const redirected = Object.defineProperty(new Response(null, { status: 200 }), 'type', {
      value: 'opaqueredirect',
    });

    expect(await readArrivalsAnswer(Response.json({}, { status: 401 }))).toEqual({
      kind: 'signed-out',
    });
    expect(await readArrivalsAnswer(redirected)).toEqual({ kind: 'signed-out' });
  });

  it('reports any other refusal with its status, malformed bodies included', async () => {
    expect(await readArrivalsAnswer(Response.json({}, { status: 429 }))).toEqual({
      kind: 'refused',
      status: 429,
    });
    expect(await readArrivalsAnswer(Response.json({ asOf: 'now' }))).toEqual({
      kind: 'refused',
      status: 200,
    });
  });
});
