import { TEXT_LINK } from '@/components/ui/control-classes';
import { SUPPORT_EMAIL } from '@/domain/accounts';
import { rich } from '@/i18n/rich';

export interface HelpLink {
  readonly label: string;
  readonly href: string;
}

export interface NoCodeHelpProps {
  readonly message: string;
  readonly support: string;
  readonly plans: HelpLink;
  readonly signUp?: HelpLink;
}

export function NoCodeHelp({ message, support, plans, signUp }: NoCodeHelpProps) {
  return (
    <div className="flex flex-col gap-1.5 border-t border-line pt-4 text-sm leading-5 text-muted">
      <p>
        {rich(message, {
          strong: (text) => <strong className="font-semibold text-ink">{text}</strong>,
        })}
      </p>
      <p>
        {rich(support, {
          mail: (text) => (
            <a href={`mailto:${SUPPORT_EMAIL}`} className={TEXT_LINK}>
              {text}
            </a>
          ),
        })}
      </p>
      <p className="flex flex-wrap gap-x-4 gap-y-1">
        <a href={plans.href} className={TEXT_LINK}>
          {plans.label}
        </a>
        {signUp === undefined ? null : (
          <a href={signUp.href} className={TEXT_LINK}>
            {signUp.label}
          </a>
        )}
      </p>
    </div>
  );
}
