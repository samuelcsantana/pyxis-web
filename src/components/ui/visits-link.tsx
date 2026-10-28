import Link from 'next/link';
import { Breakable } from './breakable';
import { ROW_LINK } from './panel-classes';
import { type RowFilter, RowFilterLink } from './row-filter-link';

export interface VisitsLinkProps {
  readonly href: string;
  readonly label: string;
  readonly purpose: string;
  readonly className?: string;
  readonly filter?: RowFilter | null;
}

export function VisitsLink({
  href,
  label,
  purpose,
  className = '',
  filter = null,
}: VisitsLinkProps) {
  const link = (
    <Link href={href} aria-label={`${label}${purpose}`} className={`${ROW_LINK} ${className}`}>
      <Breakable text={label} />
    </Link>
  );
  if (filter === null) {
    return link;
  }
  return (
    <span className="inline-flex max-w-full items-center gap-1.5">
      {link}
      <RowFilterLink filter={filter} />
    </span>
  );
}
