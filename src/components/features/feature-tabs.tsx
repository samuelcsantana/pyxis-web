import Link from 'next/link';
import type { FeatureKind } from '@/domain/features';
import { TAB, TAB_IDLE, TAB_SELECTED } from '@/components/ui/control-classes';

export interface FeatureTab {
  readonly kind: FeatureKind;
  readonly label: string;
  readonly href: string;
}

export interface FeatureTabsProps {
  readonly tabs: readonly FeatureTab[];
  readonly current: FeatureKind;
}

const TAB_CLASS = `min-h-11 px-4 ${TAB}`;

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
            className={`${TAB_CLASS} ${selected ? TAB_SELECTED : TAB_IDLE}`}
          >
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}
