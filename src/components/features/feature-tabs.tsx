import type { FeatureKind } from '@/domain/features';
import { LinkTabs } from '@/components/ui/link-tabs';

export interface FeatureTab {
  readonly kind: FeatureKind;
  readonly label: string;
  readonly href: string;
}

export interface FeatureTabsProps {
  readonly tabs: readonly FeatureTab[];
  readonly current: FeatureKind;
}

export function FeatureTabs({ tabs, current }: FeatureTabsProps) {
  return (
    <LinkTabs
      label="Feature kind"
      current={current}
      tabs={tabs.map((tab) => ({ key: tab.kind, label: tab.label, href: tab.href }))}
    />
  );
}
