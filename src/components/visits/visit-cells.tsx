import Link from 'next/link';
import { NO_VALUE } from '@/domain/metrics';
import type { VisitAccount, VisitRow } from '@/domain/visits';
import { Breakable } from '@/components/ui/breakable';
import { TEXT_LINK } from '@/components/ui/control-classes';
import { linkWith } from '@/components/shell/screens';

export const VISIT_CHIP = 'rounded-pill px-2 py-0.5 text-xs font-medium whitespace-nowrap';
export const FAILED_CHIP = `${VISIT_CHIP} bg-bad-soft font-semibold text-bad`;

function timelineHref(timelinePath: string, lookup: Record<string, string>): string {
  return linkWith(timelinePath, lookup);
}

export function VisitStartLink({ row, timelinePath }: { row: VisitRow; timelinePath: string }) {
  return (
    <Link
      href={timelineHref(timelinePath, { visit: row.key })}
      aria-label={row.openLabel}
      className={TEXT_LINK}
    >
      <time dateTime={row.startedAt}>{row.started}</time>
    </Link>
  );
}

export function AccountCell({
  account,
  timelinePath,
  anonymous,
}: {
  account: VisitAccount | null;
  timelinePath: string;
  anonymous: string;
}) {
  if (account === null) {
    return <span className="text-muted">{anonymous}</span>;
  }
  return (
    <Link
      href={timelineHref(timelinePath, { user: account.userId })}
      aria-label={account.linkName}
      className={`${TEXT_LINK} font-mono text-xs`}
    >
      {account.shown}
    </Link>
  );
}

export function Highlights({ labels }: { labels: readonly string[] }) {
  if (labels.length === 0) {
    return <span className="text-muted">{NO_VALUE}</span>;
  }
  return (
    <ul className="flex flex-wrap gap-1">
      {labels.map((label) => (
        <li key={label} className={`${VISIT_CHIP} bg-soft text-ink`}>
          {label}
        </li>
      ))}
    </ul>
  );
}

export function EntryPath({ path }: { path: string | null }) {
  return path === null ? (
    <span className="font-sans text-muted">{NO_VALUE}</span>
  ) : (
    <Breakable text={path} />
  );
}
