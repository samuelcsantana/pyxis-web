import { render, screen } from '@testing-library/react';
import type { ReactNode } from 'react';
import { describe, expect, it } from 'vitest';
import AcquisitionLoading from '@/app/[projectId]/(screens)/acquisition/loading';
import DevicesLoading from '@/app/[projectId]/(screens)/devices/loading';
import FeaturesLoading from '@/app/[projectId]/(screens)/features/loading';
import FunnelLoading from '@/app/[projectId]/(screens)/funnel/loading';
import OverviewLoading from '@/app/[projectId]/(screens)/overview/loading';
import RequestsLoading from '@/app/[projectId]/(screens)/requests/loading';
import TimelineLoading from '@/app/[projectId]/(screens)/timeline/loading';
import VisitsLoading from '@/app/[projectId]/(screens)/visits/loading';

const LOADING_SCREENS: readonly (readonly [string, () => Promise<ReactNode>])[] = [
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
    'shows only the busy content of %s while it loads, under the top bar the layout keeps',
    async (title, Loading) => {
      render(await Loading());

      expect(screen.queryByRole('banner')).toBeNull();
      expect(screen.queryByRole('heading', { level: 1 })).toBeNull();
      expect(screen.getByRole('status')).toHaveTextContent(`Loading ${title}…`);
      expect(screen.getByRole('main')).toHaveAttribute('aria-busy', 'true');
      expect(screen.getByTestId('screen-top').nextElementSibling).toBe(screen.getByRole('main'));
      expect(screen.queryByRole('button')).toBeNull();
    },
  );
});
