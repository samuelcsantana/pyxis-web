import Link from 'next/link';
import { ROW_LINK } from './panel-classes';

export const VISITS_LINK_PURPOSE = ': see its visits';

export interface VisitsLinkProps {
  readonly href: string;
  readonly label: string;
  readonly purpose?: string;
  readonly className?: string;
}

export function VisitsLink({
  href,
  label,
  purpose = VISITS_LINK_PURPOSE,
  className = '',
}: VisitsLinkProps) {
  return (
    <Link href={href} aria-label={`${label}${purpose}`} className={`${ROW_LINK} ${className}`}>
      {label}
    </Link>
  );
}
