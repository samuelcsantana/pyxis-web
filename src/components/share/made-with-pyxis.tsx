import { TEXT_LINK } from '@/components/ui/control-classes';
import type { I18n } from '@/i18n/i18n';
import { rich } from '@/i18n/rich';
import { LANDING_ORIGIN } from '@/lib/site';

export interface MadeWithPyxisProps {
  readonly i18n: I18n;
}

export function MadeWithPyxis({ i18n }: MadeWithPyxisProps) {
  return (
    <header className="border-b border-line bg-soft px-4 py-2 text-center text-caption text-muted sm:px-8">
      <p>
        {rich(i18n.t('share.madeWith'), {
          link: (text) => (
            <a href={LANDING_ORIGIN} className={`font-medium ${TEXT_LINK}`}>
              {text}
            </a>
          ),
        })}
      </p>
    </header>
  );
}
