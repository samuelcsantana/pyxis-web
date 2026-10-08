import Link from 'next/link';
import { TEXT_LINK } from '@/components/ui/control-classes';
import { EmptyState } from './empty-state';

export interface NotFoundPanelProps {
  readonly title: string;
  readonly explanation: string;
  readonly href: string;
  readonly linkLabel: string;
}

export function NotFoundPanel({ title, explanation, href, linkLabel }: NotFoundPanelProps) {
  return (
    <EmptyState headingLevel="h1" title={title}>
      <p>{explanation}</p>
      <Link href={href} className={`self-start ${TEXT_LINK}`}>
        {linkLabel}
      </Link>
    </EmptyState>
  );
}
