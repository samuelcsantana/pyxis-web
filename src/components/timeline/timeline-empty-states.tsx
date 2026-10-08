import Link from 'next/link';
import { EmptyState } from '@/components/states/empty-state';
import { TEXT_LINK } from '@/components/ui/control-classes';

export interface DemoPersonLink {
  readonly userId: string;
  readonly href: string;
}

export interface LookUpPromptProps {
  readonly demoPerson: DemoPersonLink | null;
}

export function LookUpPrompt({ demoPerson }: LookUpPromptProps) {
  return (
    <EmptyState title="Look up a person or a visit">
      <p>
        Type a user id, the one your site passes to identify(), to see every visit of that person,
        or a visit id to see one visit. Events, page views and requests show in the order they
        happened, in the project&apos;s time zone.
      </p>
      {demoPerson === null ? null : (
        <p>
          <Link href={demoPerson.href} className={TEXT_LINK}>
            Open the timeline of the demo person {demoPerson.userId}
          </Link>
        </p>
      )}
    </EmptyState>
  );
}

export interface NoVisitsFoundProps {
  readonly lookupTitle: string;
}

export function NoVisitsFound({ lookupTitle }: NoVisitsFoundProps) {
  return (
    <EmptyState title={`No visits found for ${lookupTitle}`}>
      <p>
        The id may be mistyped, the visits may be older than the retention period, or the
        person&apos;s data may have been erased.
      </p>
    </EmptyState>
  );
}
