import { describe, expect, it } from 'vitest';
import NoFiltersByDefault from './default';
import NoFiltersOnTheTimeline from './timeline/page';
import NoFiltersRowOnVisits from './visits/page';
import OverviewLoading from './overview/loading';
import FunnelLoading from './funnel/loading';
import FeaturesLoading from './features/loading';
import RequestsLoading from './requests/loading';
import DevicesLoading from './devices/loading';
import AcquisitionLoading from './acquisition/loading';
import TimelineLoading from './timeline/loading';
import VisitsLoading from './visits/loading';

describe('the filters slot', () => {
  it('draws no row by default, on the timeline and on Visits, which keeps its own', () => {
    expect(NoFiltersByDefault()).toBeNull();
    expect(NoFiltersOnTheTimeline()).toBeNull();
    expect(NoFiltersRowOnVisits()).toBeNull();
  });

  it('draws nothing while a screen loads, so the top bar changes at once', () => {
    for (const loading of [
      OverviewLoading,
      FunnelLoading,
      FeaturesLoading,
      RequestsLoading,
      DevicesLoading,
      AcquisitionLoading,
      TimelineLoading,
      VisitsLoading,
    ]) {
      expect(loading()).toBeNull();
    }
  });
});
