import type { FunnelMode } from '@/domain/funnel';
import { SegmentedLinks } from '@/components/ui/segmented-links';

export interface FunnelModeLink {
  readonly mode: FunnelMode;
  readonly label: string;
  readonly href: string;
}

export interface FunnelModesProps {
  readonly links: readonly FunnelModeLink[];
  readonly current: FunnelMode;
  readonly label: string;
}

export function FunnelModes({ links, current, label }: FunnelModesProps) {
  return (
    <SegmentedLinks
      label={label}
      links={links.map((link) => ({ key: link.mode, label: link.label, href: link.href }))}
      current={current}
      className="w-fit"
    />
  );
}
