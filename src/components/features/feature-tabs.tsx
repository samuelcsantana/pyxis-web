import type { FeatureKind } from '@/domain/features';
import type { I18n } from '@/i18n/i18n';
import { LinkTabs } from '@/components/ui/link-tabs';

export interface FeatureTab {
  readonly kind: FeatureKind;
  readonly label: string;
  readonly href: string;
}

export interface FeatureTabsProps {
  readonly tabs: readonly FeatureTab[];
  readonly current: FeatureKind;
  readonly i18n: I18n;
}

export function FeatureTabs({ tabs, current, i18n }: FeatureTabsProps) {
  return (
    <LinkTabs
      label={i18n.t('features.kindLabel')}
      current={current}
      tabs={tabs.map((tab) => ({ key: tab.kind, label: tab.label, href: tab.href }))}
    />
  );
}
