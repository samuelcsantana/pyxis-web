import { TEXT_LINK } from '@/components/ui/control-classes';
import { rich } from '@/i18n/rich';

export interface HelpLink {
  readonly label: string;
  readonly href: string;
}

export interface NoCodeHelpProps {
  readonly message: string;
  readonly plans: HelpLink;
  readonly trial?: HelpLink;
}

export function NoCodeHelp({ message, plans, trial }: NoCodeHelpProps) {
  return (
    <div className="flex flex-col gap-1.5 border-t border-line pt-4 text-sm leading-5 text-muted">
      <p>
        {rich(message, {
          strong: (text) => <strong className="font-semibold text-ink">{text}</strong>,
        })}
      </p>
      <p className="flex flex-wrap gap-x-4 gap-y-1">
        <a href={plans.href} className={TEXT_LINK}>
          {plans.label}
        </a>
        {trial === undefined ? null : (
          <a href={trial.href} className={TEXT_LINK}>
            {trial.label}
          </a>
        )}
      </p>
    </div>
  );
}
