import type { I18n } from '@/i18n/i18n';
import { rich } from '@/i18n/rich';

export interface NoConversionEventProps {
  readonly i18n: I18n;
}

export function NoConversionEvent({ i18n }: NoConversionEventProps) {
  return (
    <p className="text-caption leading-5 text-muted">
      {rich(i18n.t('states.noConversionEvent'), {
        code: (text) => <code className="font-mono text-xs whitespace-nowrap">{text}</code>,
      })}
    </p>
  );
}
