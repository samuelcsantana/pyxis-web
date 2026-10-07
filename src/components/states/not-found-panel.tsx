import Link from 'next/link';
import { FOCUS_RING } from '@/components/ui/control-classes';
import { EmptyState } from './empty-state';

export const NOT_FOUND_TITLE = 'Page not found';

export interface NotFoundPanelProps {
  readonly explanation: string;
  readonly href: string;
  readonly linkLabel: string;
}

export function NotFoundPanel({ explanation, href, linkLabel }: NotFoundPanelProps) {
  return (
    <EmptyState headingLevel="h1" title="Page not found">
      <p>{explanation}</p>
      <Link
        href={href}
        className={`self-start text-sky-ink underline underline-offset-2 hover:text-ink ${FOCUS_RING}`}
      >
        {linkLabel}
      </Link>
    </EmptyState>
  );
}
