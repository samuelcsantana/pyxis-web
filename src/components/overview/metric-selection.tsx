'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { createContext, type ReactNode, startTransition, use, useOptimistic } from 'react';
import type { KpiId } from '@/domain/overview';
import {
  ACTIVITY,
  type ChartMetric,
  chartMetric,
  METRIC_PARAMETER,
  withChartMetric,
} from '@/domain/overview-chart';

interface MetricSelectionState {
  readonly shown: ChartMetric;
  readonly pending: boolean;
  readonly toggle: (metric: KpiId) => void;
}

const MetricSelectionContext = createContext<MetricSelectionState | null>(null);

function useMetricSelection(): MetricSelectionState {
  const selection = use(MetricSelectionContext);
  if (selection === null) {
    throw new Error('A metric toggle or chart area needs a MetricSelection around it.');
  }
  return selection;
}

export interface MetricSelectionProps {
  readonly available: readonly KpiId[];
  readonly children: ReactNode;
}

export function MetricSelection({ available, children }: MetricSelectionProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [shown, setShown] = useOptimistic(
    chartMetric(searchParams.get(METRIC_PARAMETER), available),
  );
  const [pending, setPending] = useOptimistic(false);

  const toggle = (metric: KpiId) => {
    const next = shown === metric ? ACTIVITY : metric;
    const query = withChartMetric(searchParams.toString(), next);
    startTransition(() => {
      setShown(next);
      setPending(true);
      router.replace(query === '' ? pathname : `${pathname}?${query}`, { scroll: false });
    });
  };

  return (
    <MetricSelectionContext value={{ shown, pending, toggle }}>{children}</MetricSelectionContext>
  );
}

const TOGGLE =
  "cursor-pointer text-left outline-none after:absolute after:inset-0 after:rounded-card after:content-['']";

export interface MetricToggleProps {
  readonly metric: KpiId;
  readonly label: string;
  readonly describedBy: string;
}

export function MetricToggle({ metric, label, describedBy }: MetricToggleProps) {
  const { shown, toggle } = useMetricSelection();
  return (
    <button
      type="button"
      aria-pressed={shown === metric}
      aria-describedby={describedBy}
      onClick={() => {
        toggle(metric);
      }}
      className={TOGGLE}
    >
      {label}
    </button>
  );
}

const BUSY_DIMMING =
  'transition-opacity duration-150 motion-reduce:transition-none aria-busy:opacity-60';

export function MetricChartArea({ children }: { readonly children: ReactNode }) {
  const { pending } = useMetricSelection();
  return (
    <div aria-busy={pending} className={BUSY_DIMMING}>
      {children}
    </div>
  );
}
