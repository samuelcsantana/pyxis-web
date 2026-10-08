'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { createContext, type ReactNode, startTransition, use, useOptimistic } from 'react';
import { useHoldNavigationWhile } from '@/components/shell/navigation-pending';
import { PendingBar } from '@/components/ui/pending-mark';
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
  readonly pressing: KpiId | null;
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
  const [pressing, setPressing] = useOptimistic<KpiId | null>(null);
  useHoldNavigationWhile(pressing !== null);

  const toggle = (metric: KpiId) => {
    const next = shown === metric ? ACTIVITY : metric;
    const query = withChartMetric(searchParams.toString(), next);
    startTransition(() => {
      setShown(next);
      setPressing(metric);
      router.replace(query === '' ? pathname : `${pathname}?${query}`, { scroll: false });
    });
  };

  return (
    <MetricSelectionContext value={{ shown, pressing, toggle }}>{children}</MetricSelectionContext>
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
  const { shown, pressing, toggle } = useMetricSelection();
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
      <PendingBar pending={pressing === metric} />
    </button>
  );
}

export function MetricChartArea({ children }: { readonly children: ReactNode }) {
  const { pressing } = useMetricSelection();
  return <div aria-busy={pressing !== null}>{children}</div>;
}
