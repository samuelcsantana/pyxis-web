import { render, screen } from '@testing-library/react';
import type { ComponentType } from 'react';
import { describe, expect, it } from 'vitest';
import AcquisitionLoading from '@/app/[projectId]/acquisition/loading';
import DevicesLoading from '@/app/[projectId]/devices/loading';
import FeaturesLoading from '@/app/[projectId]/features/loading';
import FunnelLoading from '@/app/[projectId]/funnel/loading';
import OverviewLoading from '@/app/[projectId]/overview/loading';
import RequestsLoading from '@/app/[projectId]/requests/loading';
import TimelineLoading from '@/app/[projectId]/timeline/loading';
import VisitsLoading from '@/app/[projectId]/visits/loading';

const LOADING_SCREENS: readonly (readonly [string, ComponentType])[] = [
  ['Overview', OverviewLoading],
  ['Funnel', FunnelLoading],
  ['Features', FeaturesLoading],
  ['Requests', RequestsLoading],
  ['Timeline', TimelineLoading],
  ['Visits', VisitsLoading],
  ['Devices', DevicesLoading],
  ['Acquisition', AcquisitionLoading],
];

describe('screen loading states', () => {
  it.each(LOADING_SCREENS)(
    'keeps the top bar with the title of %s while it loads, without a control to swap out',
    (title, Loading) => {
      render(<Loading />);

      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(title);
      expect(screen.getByRole('status')).toHaveTextContent(`Loading ${title}…`);
      expect(screen.getByRole('main')).toHaveAttribute('aria-busy', 'true');
      expect(screen.queryByRole('button')).toBeNull();
    },
  );

  it('holds the place of the period controls on every screen that has a period', () => {
    const { container, unmount } = render(<OverviewLoading />);
    expect(container.querySelector('header .rounded-pill')).not.toBeNull();
    unmount();

    const timeline = render(<TimelineLoading />);

    expect(timeline.container.querySelector('header .rounded-pill')).toBeNull();
  });
});
