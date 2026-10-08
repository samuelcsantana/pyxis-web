import Link from 'next/link';
import { EmptyState } from '@/components/states/empty-state';
import { TEXT_LINK } from '@/components/ui/control-classes';
import type { I18n } from '@/i18n/i18n';
import { rich } from '@/i18n/rich';

export interface BuildAFunnelProps {
  readonly exampleHref: string;
  readonly i18n: I18n;
}

export function BuildAFunnel({ exampleHref, i18n }: BuildAFunnelProps) {
  return (
    <EmptyState title={i18n.t('funnel.build.title')}>
      <p>
        {rich(i18n.t('funnel.build.body'), {
          code: (text) => <code className="font-mono">{text}</code>,
        })}
      </p>
      <p>
        <Link href={exampleHref} className={TEXT_LINK}>
          {i18n.t('funnel.build.example')}
        </Link>
      </p>
    </EmptyState>
  );
}
