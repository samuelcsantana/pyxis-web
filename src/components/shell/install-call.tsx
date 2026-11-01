'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { CONTROL_TRANSITION, FOCUS_RING } from '@/components/ui/control-classes';
import { useT } from '@/i18n/messages-provider';
import { hrefKeepingView, installHref } from './screens';

const SPOKEN_SEPARATOR = ', ';
const CALL = `inline-flex min-h-10 shrink-0 items-center gap-2 rounded-input bg-accent px-3 text-caption font-semibold whitespace-nowrap text-accent-ink hover:bg-accent-hover active:bg-accent-pressed max-lg:min-h-11 ${FOCUS_RING} ${CONTROL_TRANSITION}`;

export interface InstallCallProps {
  readonly projectId: string;
  readonly waiting: string;
}

export function InstallCall({ projectId, waiting }: InstallCallProps) {
  const t = useT();
  const search = useSearchParams();
  return (
    <Link href={hrefKeepingView(installHref(projectId), search)} scroll={false} className={CALL}>
      <span
        aria-hidden="true"
        className="size-2 rounded-full bg-current opacity-60 motion-safe:animate-pulse"
      />
      {t('nav.installCta')}
      <span className="sr-only">{`${SPOKEN_SEPARATOR}${waiting}`}</span>
    </Link>
  );
}
