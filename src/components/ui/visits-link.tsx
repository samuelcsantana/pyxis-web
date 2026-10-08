import Link from 'next/link';
import { Breakable } from './breakable';
import { ROW_LINK } from './panel-classes';

export interface VisitsLinkProps {
  readonly href: string;
  readonly label: string;
  readonly purpose: string;
  readonly className?: string;
}

export function VisitsLink({ href, label, purpose, className = '' }: VisitsLinkProps) {
  return (
    <Link href={href} aria-label={`${label}${purpose}`} className={`${ROW_LINK} ${className}`}>
      <Breakable text={label} />
    </Link>
  );
}
