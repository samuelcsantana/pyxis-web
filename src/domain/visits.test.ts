import { describe, expect, it } from 'vitest';
import {
  deviceFilterOf,
  hasVisitFilters,
  isVisitCursor,
  NO_VISIT_FILTERS,
  visitFilterCount,
  visitFilterParameters,
  visitFiltersOf,
  visitRows,
  type VisitsWire,
} from './visits';
import { visitsResponseSchema } from './visits.schema';
import { english } from '@/test-utils/english';

const WIRE: VisitsWire = {
  visits: [
    {
      session_id: '3c07a1b2-0000-4000-8000-000000000001',
      started_at: '2026-10-05T21:40:00.000Z',
      ended_at: '2026-10-05T21:42:41.000Z',
      entry_path: '/calculator',
      page_views: 3,
      highlights: ['calculator_result_shown', 'cta_clicked'],
      failed_requests: 1,
      device_type: 'mobile',
      browser: 'safari',
      os: 'ios',
      country: 'BR',
      channel: 'paid',
      user_id: 'u_check_visits',
    },
    {
      session_id: '9d8e7f6a-0000-4000-8000-000000000002',
      started_at: '2026-10-05T03:05:00.000Z',
      ended_at: '2026-10-05T03:05:00.000Z',
      entry_path: null,
      page_views: 0,
      highlights: [],
      failed_requests: 0,
      device_type: 'desktop',
      browser: 'chrome',
      os: 'windows',
      country: null,
      channel: null,
      user_id: null,
    },
  ],
  next_cursor: '2026-10-05T03:05:00.000Z~9d8e7f6a-0000-4000-8000-000000000002',
};

describe('visitsResponseSchema', () => {
  it('reads the visits in camel case with the cursor of the next page', () => {
    const report = visitsResponseSchema.parse(WIRE);

    expect(report.visits[0]).toEqual({
      sessionId: '3c07a1b2-0000-4000-8000-000000000001',
      startedAt: '2026-10-05T21:40:00.000Z',
      endedAt: '2026-10-05T21:42:41.000Z',
      entryPath: '/calculator',
      pageViews: 3,
      highlights: ['calculator_result_shown', 'cta_clicked'],
      failedRequests: 1,
      deviceType: 'mobile',
      browser: 'safari',
      os: 'ios',
      country: 'BR',
      channel: 'paid',
      userId: 'u_check_visits',
    });
    expect(report.nextCursor).toBe(WIRE.next_cursor);
  });
});

describe('visitFiltersOf', () => {
  it('reads every filter from the URL', () => {
    const reading = visitFiltersOf({
      path: '/calculator-shipping',
      path2: ' /calculator-* ',
      path3: '/sign-up',
      event: 'calculator_result_shown',
      property: 'calculator=margin',
      channel: 'paid',
      device: 'mobile',
      identity: 'anonymous',
    });

    expect(reading).toEqual({
      filters: {
        paths: ['/calculator-shipping', '/calculator-*', '/sign-up'],
        event: 'calculator_result_shown',
        property: 'calculator=margin',
        channel: 'paid',
        device: 'mobile',
        identity: 'anonymous',
      },
      problems: [],
    });
  });

  it('reads no filter from an empty form or a URL without filters', () => {
    const emptyForm = {
      path: '',
      path2: '',
      path3: '',
      event: '',
      property: '',
      channel: '',
      device: '',
      identity: '',
    };

    expect(visitFiltersOf(emptyForm)).toEqual({ filters: NO_VISIT_FILTERS, problems: [] });
    expect(visitFiltersOf({})).toEqual({ filters: NO_VISIT_FILTERS, problems: [] });
  });

  it('keeps the pages typed in any of the three fields, in order', () => {
    expect(visitFiltersOf({ path3: '/pricing', path: '/' }).filters.paths).toEqual([
      '/',
      '/pricing',
    ]);
  });

  it('leaves out a page or an event that the API would refuse, and says why once', () => {
    const reading = visitFiltersOf({
      path: 'pricing',
      path2: 'checkout',
      path3: `/${'a'.repeat(256)}`,
      event: 'Signup Completed',
    });

    expect(reading.filters).toEqual(NO_VISIT_FILTERS);
    expect(reading.problems).toEqual([
      'A page path starts with "/".',
      'A page path has at most 256 characters.',
      'An event name starts with a lowercase letter and holds only lowercase letters, digits and _, 64 at most.',
    ]);
  });

  it('leaves out a property without a valid event', () => {
    const withoutEvent = visitFiltersOf({ property: 'calculator=shipping' });
    const withBadEvent = visitFiltersOf({ event: 'Bad', property: 'calculator=shipping' });

    expect(withoutEvent.filters.property).toBeNull();
    expect(withoutEvent.problems).toEqual(['A property filter needs an event.']);
    expect(withBadEvent.filters.property).toBeNull();
    expect(withBadEvent.problems).toContain('A property filter needs an event.');
  });

  it.each([
    ['without an equals sign', 'calculator'],
    ['with an uppercase key', 'Calculator=shipping'],
    ['with an empty key', '=shipping'],
    ['with an empty value', 'calculator='],
    ['with a value over 100 characters', `calculator=${'x'.repeat(101)}`],
  ])('leaves out a property %s', (_case, property) => {
    const reading = visitFiltersOf({ event: 'calculator_result_shown', property });

    expect(reading.filters).toEqual({ ...NO_VISIT_FILTERS, event: 'calculator_result_shown' });
    expect(reading.problems).toEqual([
      'A property filter is key=value: a key of lowercase letters, digits and _, and a value of 1 to 100 characters.',
    ]);
  });

  it('keeps an equals sign inside the property value', () => {
    expect(visitFiltersOf({ event: 'cta_clicked', property: 'query=a=b' }).filters.property).toBe(
      'query=a=b',
    );
  });

  it('ignores an unknown choice or a repeated parameter', () => {
    expect(
      visitFiltersOf({
        path: ['/a', '/b'],
        channel: 'billboard',
        device: 'watch',
        identity: 'someone',
      }),
    ).toEqual({ filters: NO_VISIT_FILTERS, problems: [] });
  });
});

describe('visitFilterParameters', () => {
  it('writes the filters back as URL parameters, one per page field', () => {
    expect(
      visitFilterParameters({
        paths: ['/calculator-shipping', '/calculator-margin'],
        event: 'calculator_result_shown',
        property: 'calculator=margin',
        channel: 'paid',
        device: 'mobile',
        identity: 'identified',
      }),
    ).toEqual({
      path: '/calculator-shipping',
      path2: '/calculator-margin',
      event: 'calculator_result_shown',
      property: 'calculator=margin',
      channel: 'paid',
      device: 'mobile',
      identity: 'identified',
    });
  });

  it('writes nothing without filters', () => {
    expect(visitFilterParameters(NO_VISIT_FILTERS)).toEqual({});
  });
});

describe('visitFilterCount', () => {
  it('counts each filter in use once, every page field on its own', () => {
    expect(visitFilterCount(NO_VISIT_FILTERS)).toBe(0);
    expect(
      visitFilterCount({
        ...NO_VISIT_FILTERS,
        paths: ['/pricing', '/sign-up'],
        event: 'signup_completed',
        device: 'mobile',
      }),
    ).toBe(4);
  });
});

describe('hasVisitFilters', () => {
  it('tells a filtered list from the whole period', () => {
    expect(hasVisitFilters(NO_VISIT_FILTERS)).toBe(false);
    expect(hasVisitFilters({ ...NO_VISIT_FILTERS, identity: 'anonymous' })).toBe(true);
  });
});

describe('deviceFilterOf', () => {
  it('filters by a device type Visits knows and by nothing else', () => {
    expect(deviceFilterOf('tablet')).toBe('tablet');
    expect(deviceFilterOf('other')).toBe('other');
    expect(deviceFilterOf('watch')).toBeNull();
  });
});

describe('isVisitCursor', () => {
  it('accepts the cursor the API sends and nothing else', () => {
    expect(isVisitCursor('2026-10-05T03:05:00.000Z~9d8e7f6a-0000-4000-8000-000000000002')).toBe(
      true,
    );
    expect(isVisitCursor('2026-10-05T03:05:00Z~9d8e7f6a-0000-4000-8000-000000000002')).toBe(true);
    expect(isVisitCursor('2026-10-05~9d8e7f6a-0000-4000-8000-000000000002')).toBe(false);
    expect(isVisitCursor('2026-10-05T03:05:00.000Z')).toBe(false);
    expect(isVisitCursor('2026-10-05T03:05:00.000Z~not-a-visit')).toBe(false);
  });
});

describe('visitRows', () => {
  it('describes each visit in the project time zone', () => {
    const [first, second] = visitRows(
      visitsResponseSchema.parse(WIRE).visits,
      'America/Sao_Paulo',
      english,
    );

    expect(first).toEqual({
      key: '3c07a1b2-0000-4000-8000-000000000001',
      visit: '3c07a1b2',
      started: 'Mon, Oct 5, 18:40',
      startedAt: '2026-10-05T21:40:00.000Z',
      duration: '2 min 41 s',
      entryPath: '/calculator',
      pageViews: '3',
      pagesLabel: '3 pages',
      highlights: ['Calculator result shown', 'CTA clicked'],
      failedRequests: 1,
      failedRequestsLabel: '1 failed request',
      device: 'Mobile · Safari · iOS · Brazil',
      channel: 'Paid',
      account: {
        userId: 'u_check_visits',
        shown: 'u_check_…',
        linkName: 'u_check_…, open the timeline of user u_check_visits',
      },
    });
    expect(second).toMatchObject({
      started: 'Mon, Oct 5, 00:05',
      duration: '0 s',
      entryPath: null,
      pageViews: '0',
      pagesLabel: '0 pages',
      failedRequestsLabel: 'No failed request',
      device: 'Desktop · Chrome · Windows',
      channel: null,
      account: null,
    });
  });

  it('says one page and counts several failed requests', () => {
    const [row] = visitRows(
      visitsResponseSchema.parse({
        ...WIRE,
        visits: WIRE.visits
          .slice(0, 1)
          .map((visit) => ({ ...visit, page_views: 1, failed_requests: 2 })),
      }).visits,
      'UTC',
      english,
    );

    expect(row).toMatchObject({ pagesLabel: '1 page', failedRequestsLabel: '2 failed requests' });
  });

  it('shows a short user id whole', () => {
    const [row] = visitRows(
      visitsResponseSchema.parse({
        ...WIRE,
        visits: WIRE.visits.slice(0, 1).map((visit) => ({ ...visit, user_id: 'u_7f3a' })),
      }).visits,
      'UTC',
      english,
    );

    expect(row?.account).toEqual({
      userId: 'u_7f3a',
      shown: 'u_7f3a',
      linkName: 'u_7f3a, open the timeline of this user',
    });
  });
});
