import Link from 'next/link';
import type { FeatureKind } from '@/domain/features';
import { FOCUS_RING } from '@/components/ui/control-classes';

export interface FeatureTab {
  readonly kind: FeatureKind;
  readonly label: string;
  readonly href: string;
}

export interface FeatureTabsProps {
  readonly tabs: readonly FeatureTab[];
  readonly current: FeatureKind;
}

const TAB_CLASS = `flex min-h-11 items-center border-b-2 px-4 text-sm font-semibold ${FOCUS_RING}`;

export function FeatureTabs({ tabs, current }: FeatureTabsProps) {
  return (
    <nav aria-label="Feature kind" className="flex gap-1 border-b border-line">
      {tabs.map((tab) => {
        const selected = tab.kind === current;
        return (
          <Link
            key={tab.kind}
            href={tab.href}
            aria-current={selected ? 'page' : undefined}
            className={`${TAB_CLASS} ${selected ? 'border-ink text-ink' : 'border-transparent text-muted hover:text-ink'}`}
          >
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}
