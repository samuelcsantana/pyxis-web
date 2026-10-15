import Link from 'next/link';
import { TEXT_LINK } from '@/components/ui/control-classes';
import type { I18n } from '@/i18n/i18n';
import { rich } from '@/i18n/rich';

export type NoLiveKeyStep =
  | { readonly kind: 'createBelow' }
  | { readonly kind: 'createInSettings'; readonly keysHref: string }
  | { readonly kind: 'ownerOnly' };

export interface NoLiveKeyNoticeProps {
  readonly step: NoLiveKeyStep;
  readonly i18n: I18n;
}

function nextStep(step: NoLiveKeyStep, i18n: I18n) {
  switch (step.kind) {
    case 'createBelow':
      return i18n.t('settings.keys.createBelow');
    case 'createInSettings':
      return rich(i18n.t('settings.keys.createInSettings'), {
        settings: (text) => (
          <Link href={step.keysHref} className={TEXT_LINK}>
            {text}
          </Link>
        ),
      });
    case 'ownerOnly':
      return i18n.t('settings.keys.ownerOnly');
  }
}

export function NoLiveKeyNotice({ step, i18n }: NoLiveKeyNoticeProps) {
  return (
    <div className="flex flex-col gap-1 rounded-input bg-bad-soft px-3 py-2.5 text-sm text-bad">
      <p className="font-medium">{i18n.t('settings.keys.noLiveKey')}</p>
      <p>{i18n.t('settings.keys.revokedForGood')}</p>
      <p>{nextStep(step, i18n)}</p>
    </div>
  );
}
