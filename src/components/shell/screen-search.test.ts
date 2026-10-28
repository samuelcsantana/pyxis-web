import { describe, expect, it } from 'vitest';
import { DASHBOARD_FILTER_PARAMETERS } from '@/domain/dashboard-filter-parameters';
import type { FeatureSearch } from '@/domain/features';
import type { FunnelSearch } from '@/domain/funnel';
import { SEGMENT_PARAMETER } from '@/domain/funnel-segments';
import type { FunnelDrillSearch } from '@/domain/funnel-subjects';
import { METRIC_PARAMETER } from '@/domain/overview-chart';
import type { RequestsSearch } from '@/domain/requests';
import type { VisitsSearch } from '@/domain/visits';
import { CARRIED_PARAMETERS, carriedParameters, screenSearchOf } from './screen-search';

function namesOf(search: object): ReadonlySet<string> {
  return new Set(Object.keys(search));
}

const EVERY_OVERVIEW_FILTER = { [METRIC_PARAMETER]: '' };

const EVERY_FUNNEL_FILTER_A_PERIOD_KEEPS: Required<
  FunnelSearch & Omit<FunnelDrillSearch, 'cursor'> & { readonly [SEGMENT_PARAMETER]: string }
> = { mode: '', steps: '', step: '', outcome: '', [SEGMENT_PARAMETER]: '' };

const EVERY_FEATURES_FILTER: Required<FeatureSearch> = { kind: '', q: '' };

const EVERY_REQUESTS_FILTER: Required<RequestsSearch> = { kind: '', show: '', screen: '' };

const EVERY_VISITS_FILTER: Required<VisitsSearch> = {
  path: '',
  path2: '',
  path3: '',
  event: '',
  property: '',
  channel: '',
  device: '',
  browser: '',
  os: '',
  identity: '',
  country: '',
  region: '',
  source: '',
  campaign: '',
  route: '',
  failed: '',
};

describe('screenSearchOf', () => {
  it('reads one value as a text and a repeated name as a list, as Next does for a page', () => {
    expect(screenSearchOf(new URLSearchParams('range=7d&path=%2Fa&range=30d&q='))).toEqual({
      range: ['7d', '30d'],
      path: '/a',
      q: '',
    });
    expect(screenSearchOf(new URLSearchParams())).toEqual({});
  });
});

describe('carriedParameters', () => {
  it('carries the filters of the screen as the address has them, and nothing else', () => {
    expect(
      carriedParameters(
        'visits',
        screenSearchOf(new URLSearchParams('range=7d&channel=paid&q=x&path=%2Fa&path=%2Fb')),
      ),
    ).toEqual({ channel: 'paid' });
    expect(
      carriedParameters(
        'visits',
        screenSearchOf(new URLSearchParams('path=%2F&path2=&event=&channel=paid')),
      ),
    ).toEqual({ path: '/', channel: 'paid' });
    expect(carriedParameters('timeline', screenSearchOf(new URLSearchParams('user=u1')))).toEqual(
      {},
    );
  });

  it('leaves out the page of a list, which a new period starts over', () => {
    expect(
      carriedParameters(
        'funnel',
        screenSearchOf(new URLSearchParams('steps=s&step=2&outcome=left&cursor=c1')),
      ),
    ).toEqual({ steps: 's', step: '2', outcome: 'left' });
  });
});

describe('the parameters each screen carries to another period', () => {
  const dashboardFilters = new Set<string>(DASHBOARD_FILTER_PARAMETERS);

  it.each([
    ['overview', EVERY_OVERVIEW_FILTER],
    ['funnel', EVERY_FUNNEL_FILTER_A_PERIOD_KEEPS],
    ['features', EVERY_FEATURES_FILTER],
    ['requests', EVERY_REQUESTS_FILTER],
    ['visits', EVERY_VISITS_FILTER],
  ] as const)(
    'are every filter the %s page reads, the dashboard filters among them',
    (screen, filters) => {
      expect(new Set(CARRIED_PARAMETERS[screen])).toEqual(
        new Set([...namesOf(filters), ...dashboardFilters]),
      );
    },
  );

  it('are the dashboard filters alone on Devices and Acquisition', () => {
    expect(new Set(CARRIED_PARAMETERS.devices)).toEqual(dashboardFilters);
    expect(new Set(CARRIED_PARAMETERS.acquisition)).toEqual(dashboardFilters);
  });

  it('are none on the timeline, which no filter selects', () => {
    expect(CARRIED_PARAMETERS.timeline).toEqual([]);
  });

  it('keep a filter across a change of period', () => {
    expect(
      carriedParameters('devices', screenSearchOf(new URLSearchParams('range=7d&os=ios&q=x'))),
    ).toEqual({ os: 'ios' });
  });
});
