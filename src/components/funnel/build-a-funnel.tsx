import Link from 'next/link';
import { EmptyState } from '@/components/states/empty-state';
import { TEXT_LINK } from '@/components/ui/control-classes';

export interface BuildAFunnelProps {
  readonly exampleHref: string;
}

export function BuildAFunnel({ exampleHref }: BuildAFunnelProps) {
  return (
    <EmptyState title="Build a funnel">
      <p>
        A funnel is 2 to 8 steps, each a page path (<code className="font-mono">*</code> matches any
        run of characters) or an event name. A step counts only after the step before it. The steps
        live in the address, so a bookmark keeps the funnel.
      </p>
      <p>
        <Link href={exampleHref} className={TEXT_LINK}>
          Start from an example funnel
        </Link>
      </p>
    </EmptyState>
  );
}
